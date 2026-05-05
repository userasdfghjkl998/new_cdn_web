#!/usr/bin/env bash
set -u

# 作者:飞盾CDN  
# 官网：feiduncdn.com
# 官网下载链接：https://feiduncdn.com/download/security_check.sh
# Linux 安全体检脚本
# 支持模式：
#   1) 快速检查（默认）
#   2) 深度检查（包含 ClamAV + rkhunter）
#
# 用法：
#   sudo bash security_check.sh --quick
#   sudo bash security_check.sh --deep
#   sudo bash security_check.sh --path-only "/var/www"    # 仅 ClamAV 递归扫目录
#   sudo bash security_check.sh --file-only "/etc/passwd" # 仅 ClamAV 扫单个文件
#   sudo bash security_check.sh                           # 交互选择

MODE=""
CHECKS=""
SELECTED_CHECKS=""
TARGET_PATH="/"
TARGET_PATH_TYPE="dir"
NON_INTERACTIVE=0
INTERACTIVE_MENU_CUSTOM=0

usage() {
  cat <<'EOF'
注意: 本脚本必须以 root 运行（sudo），否则无法读取安全日志、失败登录、全机 SUID 扫描、安装杀毒组件等。

用法:
  sudo bash security_check.sh --quick    快速检查
  sudo bash security_check.sh --deep     深度检查
  sudo bash security_check.sh --path-only "/var/www"   指定目录（仅 ClamAV 递归扫描）
  sudo bash security_check.sh --file-only "/path/to/file"  指定文件（仅 ClamAV 扫描该文件）
  sudo bash security_check.sh            交互菜单选择
  sudo bash security_check.sh --custom "system,ports,cron"  指定检查项（命令行含 suid/writable/clamav 时建议加 --path；菜单 3 则默认 / 并不再询问）

非交互（全程无 read 提示，适合脚本/cron）:
  sudo bash security_check.sh -n --quick
  sudo bash security_check.sh --non-interactive --deep
  sudo bash security_check.sh -n   # 无其它参数时等同 --quick
  SECURITY_CHECK_NONINTERACTIVE=1 sudo bash security_check.sh --quick

可选检查项:
  system,login,logs,process,ports,services,cron,suid,writable,accounts,clamav,rkhunter

支持环境: Linux，且为 Debian/Ubuntu 等 apt 系（脚本内使用 apt-get / systemd / journalctl 等）。
EOF
}

check_supported_system() {
  local id version id_like pretty
  if [[ "$(uname -s 2>/dev/null)" != "Linux" ]]; then
    echo "当前系统不是 Linux，本脚本不支持。"
    exit 1
  fi
  if [[ ! -r /etc/os-release ]]; then
    echo "未找到或无法读取 /etc/os-release，无法判断发行版。本脚本仅支持带该文件的 Debian/Ubuntu 系（apt）。"
    exit 1
  fi
  # shellcheck disable=SC1091
  . /etc/os-release
  id="${ID:-}"
  version="${VERSION_ID:-}"
  id_like="${ID_LIKE:-}"
  pretty="${PRETTY_NAME:-$id}"

  local ok=0
  case "$id" in
    debian|ubuntu|raspbian|linuxmint|pop|zorin|kali|elementary)
      ok=1
      ;;
  esac
  if [[ "$ok" -eq 0 ]] && echo "$id_like" | grep -qiE '(debian|ubuntu)'; then
    ok=1
  fi
  if [[ "$ok" -eq 0 ]]; then
    echo "不支持的发行版: $pretty"
    echo "说明: 本脚本按 Debian/Ubuntu（apt、systemd、journalctl）编写；CentOS/RHEL/Fedora/Arch/Alpine 等请先换对应工具或自行改写后再用。"
    exit 1
  fi

  if ! command -v dpkg >/dev/null 2>&1; then
    echo "未找到 dpkg 命令，无法进行版本校验。请确认是否为 Debian/Ubuntu 系。"
    exit 1
  fi

  case "$id" in
    debian|raspbian)
      if ! dpkg --compare-versions "${version:-0}" ge "10"; then
        echo "Debian 系版本过低（需 >= 10），当前 VERSION_ID=${version:-未知}（$pretty）"
        exit 1
      fi
      ;;
    ubuntu)
      if ! dpkg --compare-versions "${version:-0}" ge "18.04"; then
        echo "Ubuntu 版本过低（需 >= 18.04），当前 VERSION_ID=${version:-未知}（$pretty）"
        exit 1
      fi
      ;;
  esac
}

abort_noninteractive() {
  if [[ "$NON_INTERACTIVE" -eq 1 ]]; then
    echo "非交互模式: $1"
    exit 1
  fi
}

choose_mode_interactive() {
  echo "请选择运行模式:"
  echo "  1) 快速检查（推荐先跑）"
  echo "  2) 深度检查（耗时较长）"
  echo "  3) 指定检查（自定义模块）"
  echo "  4) 指定目录（仅 ClamAV 递归扫描）"
  echo "  5) 指定文件（仅 ClamAV 扫描该文件）"
  read -r -p "请输入 1/2/3/4/5: " choice
  case "$choice" in
    1) MODE="quick" ;;
    2) MODE="deep" ;;
    3)
      MODE="custom"
      INTERACTIVE_MENU_CUSTOM=1
      echo "可选模块: system,login,logs,process,ports,services,cron,suid,writable,accounts,clamav,rkhunter"
      read -r -p "请输入模块（英文逗号分隔）: " CHECKS
      echo "说明: 菜单「指定检查」在输入模块后即开始执行，不再询问路径。"
      echo "      若包含 suid/writable/clamav 且未通过命令行指定 --path，则默认扫描范围为 /。"
      ;;
    4)
      MODE="path_dir"
      read -r -p "请输入绝对路径（目录，例如 /var/www）: " TARGET_PATH
      echo "说明: 本项仅执行 ClamAV 递归扫描该目录（不运行 rkhunter / freshclam）。"
      ;;
    5)
      MODE="path_file"
      read -r -p "请输入绝对路径（文件，例如 /etc/nginx/nginx.conf）: " TARGET_PATH
      echo "说明: 本项仅执行 ClamAV 扫描该文件（不运行 rkhunter / freshclam）。"
      ;;
    *) echo "输入无效，默认使用快速检查。"; MODE="quick" ;;
  esac
}

parse_args() {
  if [[ "${SECURITY_CHECK_NONINTERACTIVE:-}" == "1" ]]; then
    NON_INTERACTIVE=1
  fi

  if [[ $# -eq 0 ]]; then
    if [[ "$NON_INTERACTIVE" -eq 1 ]]; then
      MODE="quick"
      return
    fi
    choose_mode_interactive
    return
  fi

  while [[ $# -gt 0 ]]; do
    case "${1:-}" in
      --non-interactive|-n)
        NON_INTERACTIVE=1
        shift
        ;;
      --quick)
        MODE="quick"
        shift
        ;;
      --deep)
        MODE="deep"
        shift
        ;;
      --path-only)
        MODE="path_dir"
        TARGET_PATH="${2:-}"
        if [[ -z "$TARGET_PATH" ]]; then
          echo "参数 --path-only 需要提供目录的绝对路径。"
          usage
          exit 1
        fi
        shift 2
        ;;
      --file-only)
        MODE="path_file"
        TARGET_PATH="${2:-}"
        if [[ -z "$TARGET_PATH" ]]; then
          echo "参数 --file-only 需要提供文件的绝对路径。"
          usage
          exit 1
        fi
        shift 2
        ;;
      --custom)
        MODE="custom"
        CHECKS="${2:-}"
        if [[ -z "$CHECKS" ]]; then
          echo "参数 --custom 需要提供模块列表。"
          usage
          exit 1
        fi
        shift 2
        ;;
      --path)
        TARGET_PATH="${2:-}"
        if [[ -z "$TARGET_PATH" ]]; then
          echo "参数 --path 需要提供绝对路径。"
          usage
          exit 1
        fi
        shift 2
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        echo "未知参数: $1"
        usage
        exit 1
        ;;
    esac
  done

  if [[ -z "$MODE" ]]; then
    MODE="quick"
  fi
}

require_root() {
  local uid="${EUID:-$(id -u)}"
  if [[ "$uid" -ne 0 ]]; then
    echo "错误: 当前不是 root 用户（UID=$uid），权限不足，脚本无法完整执行。"
    echo "原因包括但不限于: lastb 失败登录、journalctl(ssh/sudo)、ss 带进程信息、全文件系统 SUID 扫描、apt 安装 ClamAV/rkhunter 等均需 root。"
    echo "请使用: sudo bash security_check.sh [参数…]"
    exit 1
  fi
}

run_cmd() {
  local title="$1"
  shift
  echo -e "\n==================== ${title} ====================" | tee -a "$REPORT"
  {
    echo "+ $*"
    eval "$@"
  } >>"$REPORT" 2>&1
}

is_blank() {
  [[ -z "$(echo "${1:-}" | tr -d '[:space:]')" ]]
}

emit_section() {
  echo "" | tee -a "$REPORT"
  echo "==================== $1 ====================" | tee -a "$REPORT"
}

# 无异常内容时只写「正常」，否则写具体可疑/异常输出
emit_check_result() {
  local title="$1"
  local detail="$2"
  emit_section "$title"
  if is_blank "$detail"; then
    echo "正常" | tee -a "$REPORT"
  else
    printf '%s\n' "$detail" | tee -a "$REPORT"
  fi
}

has_check() {
  local name="$1"
  [[ ",$SELECTED_CHECKS," == *",$name,"* ]]
}

validate_custom_checks() {
  local allowed=",system,login,logs,process,ports,services,cron,suid,writable,accounts,clamav,rkhunter,"
  local normalized
  normalized="$(echo "$CHECKS" | tr '[:upper:]' '[:lower:]' | tr -d ' ')"
  if [[ -z "$normalized" ]]; then
    echo "自定义模式下，检查项不能为空。"
    exit 1
  fi

  IFS=',' read -r -a items <<<"$normalized"
  SELECTED_CHECKS=""
  for item in "${items[@]}"; do
    if [[ -z "$item" ]]; then
      continue
    fi
    if [[ "$allowed" != *",$item,"* ]]; then
      echo "未知检查项: $item"
      echo "可选: system,login,logs,process,ports,services,cron,suid,writable,accounts,clamav,rkhunter"
      exit 1
    fi
    if [[ ",$SELECTED_CHECKS," != *",$item,"* ]]; then
      if [[ -z "$SELECTED_CHECKS" ]]; then
        SELECTED_CHECKS="$item"
      else
        SELECTED_CHECKS="$SELECTED_CHECKS,$item"
      fi
    fi
  done
}

set_checks_by_mode() {
  case "$MODE" in
    quick)
      SELECTED_CHECKS="system,login,logs,process,ports,services,cron,suid,writable,accounts"
      ;;
    deep)
      SELECTED_CHECKS="system,login,logs,process,ports,services,cron,suid,writable,accounts,clamav,rkhunter"
      ;;
    path_dir|path_file)
      SELECTED_CHECKS="clamav"
      ;;
    custom)
      validate_custom_checks
      ;;
    *)
      echo "未知模式: $MODE"
      exit 1
      ;;
  esac
}

custom_needs_scan_path() {
  has_check "suid" || has_check "writable" || has_check "clamav"
}

# 根据 /var/lib/clamav 下最新 .cld/.cvd 的「修改日期」是否为本机「日历当天」判断是否今日已更新（与 freshclam 是否跑过无关，只看库文件 mtime）
clamav_signatures_updated_today() {
  local newest today fday
  [[ -d /var/lib/clamav ]] || return 1
  newest=$(find /var/lib/clamav -maxdepth 1 -type f \( -name '*.cld' -o -name '*.cvd' \) -printf '%T@\t%p\n' 2>/dev/null | sort -n | tail -1 | cut -f2-)
  [[ -n "$newest" && -f "$newest" ]] || return 1
  today=$(date +%Y-%m-%d)
  fday=$(date -r "$newest" +%Y-%m-%d 2>/dev/null || stat -c %y "$newest" 2>/dev/null | cut -c1-10)
  [[ "$fday" == "$today" ]]
}

ensure_target_path() {
  if [[ "$MODE" == "custom" ]]; then
    if custom_needs_scan_path; then
      if [[ "$NON_INTERACTIVE" -eq 1 ]] && [[ -z "${TARGET_PATH:-}" ]]; then
        abort_noninteractive "缺少扫描路径，请追加参数 --path /绝对路径（自定义含 suid/writable/clamav 时必填）。"
      fi
      if [[ "${INTERACTIVE_MENU_CUSTOM:-0}" -eq 1 ]]; then
        [[ -n "${TARGET_PATH:-}" ]] || TARGET_PATH="/"
      elif [[ -z "${TARGET_PATH:-}" ]]; then
        read -r -p "请输入绝对路径（目录或文件，作为 suid/writable/clamav 的扫描范围，例如 /var/www）: " TARGET_PATH
      fi
      if custom_needs_scan_path && [[ -z "${TARGET_PATH:-}" ]]; then
        echo "已选择 suid / writable / clamav 之一，必须提供有效的扫描绝对路径。"
        exit 1
      fi
    fi
  fi

  if [[ "$MODE" == "path_dir" && -z "${TARGET_PATH:-}" ]]; then
    abort_noninteractive "缺少目录路径，请使用参数 --path-only /绝对路径。"
    read -r -p "请输入绝对路径（目录，例如 /var/www）: " TARGET_PATH
  fi

  if [[ "$MODE" == "path_file" && -z "${TARGET_PATH:-}" ]]; then
    abort_noninteractive "缺少文件路径，请使用参数 --file-only /绝对路径。"
    read -r -p "请输入绝对路径（文件，例如 /etc/nginx/nginx.conf）: " TARGET_PATH
  fi

  if [[ -z "${TARGET_PATH:-}" ]]; then
    TARGET_PATH="/"
  fi

  if [[ "${TARGET_PATH#/}" == "$TARGET_PATH" ]]; then
    echo "路径必须是绝对路径: $TARGET_PATH"
    exit 1
  fi

  if [[ "$MODE" == "quick" || "$MODE" == "deep" ]]; then
    if [[ "$TARGET_PATH" == "/" ]]; then
      TARGET_PATH_TYPE="dir"
      return
    fi
  fi

  if [[ "$MODE" == "custom" ]] && ! custom_needs_scan_path; then
    if [[ -z "${TARGET_PATH:-}" ]]; then
      TARGET_PATH="/"
    fi
    TARGET_PATH_TYPE="dir"
    return
  fi

  if [[ "$MODE" == "path_dir" ]]; then
    if [[ ! -e "$TARGET_PATH" ]]; then
      echo "目录不存在: $TARGET_PATH"
      exit 1
    fi
    if [[ ! -d "$TARGET_PATH" ]]; then
      echo "该路径不是目录，请使用菜单 5) 或参数 --file-only: $TARGET_PATH"
      exit 1
    fi
    TARGET_PATH_TYPE="dir"
    return
  fi

  if [[ "$MODE" == "path_file" ]]; then
    if [[ ! -e "$TARGET_PATH" ]]; then
      echo "文件不存在: $TARGET_PATH"
      exit 1
    fi
    if [[ ! -f "$TARGET_PATH" ]]; then
      echo "该路径不是普通文件，请使用菜单 4) 或参数 --path-only: $TARGET_PATH"
      exit 1
    fi
    TARGET_PATH_TYPE="file"
    return
  fi

  if [[ ! -e "$TARGET_PATH" ]]; then
    echo "路径不存在: $TARGET_PATH"
    exit 1
  fi
  if [[ -f "$TARGET_PATH" ]]; then
    TARGET_PATH_TYPE="file"
  elif [[ -d "$TARGET_PATH" ]]; then
    TARGET_PATH_TYPE="dir"
  else
    echo "仅支持普通文件或目录（不支持设备/套接字等）: $TARGET_PATH"
    exit 1
  fi
}

main() {
  parse_args "$@"
  check_supported_system
  require_root
  set_checks_by_mode
  ensure_target_path

  local ts host out_dir
  ts="$(date +%F_%H-%M-%S)"
  host="$(hostname)"
  out_dir="/tmp/security-check-${host}-${ts}"
  REPORT="${out_dir}/report.txt"
  mkdir -p "$out_dir"

  echo "主机: $host" >"$REPORT"
  echo "时间: $(date)" >>"$REPORT"
  echo "模式: $MODE" >>"$REPORT"
  echo "非交互: $NON_INTERACTIVE" >>"$REPORT"
  echo "检查项: $SELECTED_CHECKS" >>"$REPORT"
  echo "检查路径: $TARGET_PATH" >>"$REPORT"
  echo "检查路径类型: $TARGET_PATH_TYPE" >>"$REPORT"
  echo "内核: $(uname -a)" >>"$REPORT"

  if has_check "system"; then
    emit_section "系统信息"
    {
      echo "正常"
      echo "摘要: $(grep ^PRETTY_NAME= /etc/os-release 2>/dev/null | cut -d= -f2- | tr -d '\"'); 内核 $(uname -r)"
      echo "运行时长: $(uptime -p 2>/dev/null || uptime | awk -F'load average' '{print \$1}')"
    } | tee -a "$REPORT"
  fi

  if has_check "login"; then
    local lb_out
    lb_out=$(lastb 2>/dev/null | head -n 80 || true)
    emit_check_result "失败登录(lastb)" "$lb_out"
    local la_out
    la_out=$(last -ai 2>/dev/null | head -n 20 | grep -E 'still logged in|root[[:space:]]' || true)
    emit_check_result "成功登录摘要(仅 root / 仍在线)" "$la_out"
  fi

  if has_check "logs"; then
    local log_hits
    log_hits=$(
      {
        journalctl -u ssh --since '7 days ago' --no-pager 2>/dev/null
        journalctl _COMM=sudo --since '7 days ago' --no-pager 2>/dev/null
      } | grep -iE 'fail|invalid|error|refused|denied|authentication failure|break-in|possible break' | tail -n 120 || true
    )
    emit_check_result "SSH/SUDO 日志疑点(近7天)" "$log_hits"
  fi

  if has_check "process"; then
    local ps_out
    ps_out=$(
      ps auxww 2>/dev/null | grep -iE 'xmrig|minerd|kdevtmpfsi|kinsing|masscan|reptile|libprocesshider|\.mining|cryptonight|stratum\+tcp|/tmp/[./]|/dev/shm/[./]' | grep -v grep || true
    )
    emit_check_result "进程疑点(启发式关键字)" "$ps_out"
  fi

  if has_check "ports"; then
    local odd_listen
    odd_listen=$(
      ss -lntup 2>/dev/null | grep LISTEN | grep -Ev '127\.0\.0\.1:|\[::1\]:' | grep -Ev ':(22|23|25|53|80|110|111|123|143|443|465|587|993|995|853|3000|3306|5432|6379|8000|8080|8443|9000|9100) ' |
        grep -viE '\"(docker-proxy|kube-proxy)\"' |
        head -n 80 || true
    )
    emit_check_result "对外监听端口(排除回环/常见端口; nginx/php/mysql/redis 等非常规端口仍会列出, 需复核)" "$odd_listen"
    local est_n
    est_n=$(ss -H -ant state established 2>/dev/null | wc -l | tr -d ' ')
    if [[ "${est_n:-0}" =~ ^[0-9]+$ ]] && [[ "$est_n" -gt 2000 ]]; then
      emit_check_result "活跃连接数量" "ESTAB 连接数偏多: ${est_n}（请结合业务复核）"
    else
      emit_check_result "活跃连接数量" ""
    fi
  fi

  if has_check "services"; then
    local sus_svc
    sus_svc=$(
      systemctl list-unit-files --type=service --state=enabled --no-pager 2>/dev/null | grep -iE 'telnet|rsh|rexec|finger|nfs-server|tftp|vsftpd' | head -n 50 || true
    )
    emit_check_result "自启服务(可疑项)" "$sus_svc"
  fi

  if has_check "cron"; then
    local cron_sus
    cron_sus=$(
      {
        crontab -l 2>/dev/null || true
        grep -rhv '^[[:space:]]*#' /etc/crontab /etc/cron.d /etc/cron.daily /etc/cron.hourly /etc/cron.weekly /etc/cron.monthly 2>/dev/null || true
      } | grep -iE 'wget|curl|fetch |bash -c|/dev/tcp|python[0-9]?[[:space:]]|perl[[:space:]]|nc[[:space:]]|netcat|base64[[:space:]]*-d|/tmp/[a-zA-Z0-9]{8,}' | head -n 80 || true
    )
    emit_check_result "计划任务(可疑行)" "$cron_sus"
  fi

  if has_check "suid"; then
    local suid_odd
    suid_odd=$(
      find "$TARGET_PATH" -xdev \( -perm -4000 -o -perm -2000 \) -type f 2>/dev/null | grep -Ev '^/(usr|bin|sbin|snap)/' | sort | head -n 200 || true
    )
    emit_check_result "SUID/SGID(非标准路径, 需关注)" "$suid_odd"
  fi

  if has_check "writable"; then
    local wdir
    if [[ "$TARGET_PATH_TYPE" == "file" ]]; then
      wdir=$(
        find "$(dirname "$TARGET_PATH")" -maxdepth 1 \( -path /proc -o -path /sys -o -path /dev -o -path /run \) -prune -o -type d -perm -0002 -print 2>/dev/null | grep -Ev '^/(tmp|var/tmp)(/|$)' | head -n 500 || true
      )
    else
      wdir=$(
        find "$TARGET_PATH" \( -path /proc -o -path /sys -o -path /dev -o -path /run \) -prune -o -type d -perm -0002 -print 2>/dev/null | grep -Ev '^/(tmp|var/tmp)(/|$)' | head -n 500 || true
      )
    fi
    emit_check_result "世界可写目录(已排除 /tmp /var/tmp)" "$wdir"
  fi

  if has_check "accounts"; then
    local acc_issues
    acc_issues=""
    local uid0
    uid0=$(awk -F: '$3==0 && $1!="root" {print}' /etc/passwd 2>/dev/null || true)
    [[ -n "$uid0" ]] && acc_issues+="非 root 但 UID=0 的账号:\n$uid0\n"
    if [[ -r /etc/ssh/sshd_config ]]; then
      local prl pwa
      prl=$(grep -E '^[[:space:]]*PermitRootLogin[[:space:]]+' /etc/ssh/sshd_config | grep -v '^[[:space:]]*#' | tail -n 1 || true)
      pwa=$(grep -E '^[[:space:]]*PasswordAuthentication[[:space:]]+' /etc/ssh/sshd_config | grep -v '^[[:space:]]*#' | tail -n 1 || true)
      if echo "$prl" | grep -qiE '^[[:space:]]*PermitRootLogin[[:space:]]+yes([[:space:]]|#|$)'; then
        acc_issues+="SSH PermitRootLogin=yes(允许 root 密码直连, 建议复核): $prl\n"
      fi
      if echo "$pwa" | grep -qiE '^[[:space:]]*PasswordAuthentication[[:space:]]+yes'; then
        acc_issues+="SSH 已启用密码登录(按策略复核): $pwa\n"
      fi
    fi
    emit_check_result "账号与 SSH 配置疑点" "$(printf '%b' "$acc_issues")"
  fi

  if has_check "clamav"; then
    local apt_log fc_log scan_out
    local apt_pkgs="clamav"
    has_check "rkhunter" && apt_pkgs="clamav rkhunter"
    apt_log=$(export DEBIAN_FRONTEND=noninteractive; apt-get update -y && apt-get install -y --no-install-recommends -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold' $apt_pkgs 2>&1) || true
    emit_section "ClamAV 组件安装"
    if echo "$apt_log" | grep -qiE '^E:|错误|unable to|failed'; then
      printf '%s\n' "$apt_log" | tail -n 40 | tee -a "$REPORT"
    else
      echo "正常" | tee -a "$REPORT"
    fi
    if [[ "$MODE" == "path_dir" || "$MODE" == "path_file" ]]; then
      emit_section "ClamAV 病毒库更新"
      {
        echo "已跳过 freshclam（指定目录/文件模式：避免与系统 clamav-freshclam 争用日志锁）。"
        echo "将使用当前已安装的病毒库扫描；需要更新时请单独执行: freshclam 或依赖系统定时任务。"
      } | tee -a "$REPORT"
    else
      emit_section "ClamAV 病毒库更新"
      if clamav_signatures_updated_today; then
        echo "正常（今日已更新：/var/lib/clamav 内最新 .cld/.cvd 修改日期为当天，跳过 freshclam）" | tee -a "$REPORT"
      else
        fc_log=$(freshclam 2>&1) || true
        if echo "$fc_log" | grep -qiE 'error|ERROR|failed|无法'; then
          printf '%s\n' "$fc_log" | tail -n 25 | tee -a "$REPORT"
        else
          echo "正常" | tee -a "$REPORT"
        fi
      fi
    fi
    if [[ "$TARGET_PATH_TYPE" == "file" ]]; then
      scan_out=$(clamscan -i --no-summary "$TARGET_PATH" 2>&1 || true)
    else
      scan_out=$(clamscan -r -i --no-summary "$TARGET_PATH" --exclude-dir='^/sys|^/proc|^/dev|^/run' 2>&1 || true)
    fi
    emit_check_result "ClamAV 扫描结果" "$scan_out"
  fi

  if has_check "rkhunter"; then
    if ! has_check "clamav"; then
      local apt_rk
      apt_rk=$(export DEBIAN_FRONTEND=noninteractive; apt-get update -y && apt-get install -y --no-install-recommends -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold' rkhunter 2>&1) || true
      emit_section "rkhunter 组件安装"
      if echo "$apt_rk" | grep -qiE '^E:|错误|unable to|failed'; then
        printf '%s\n' "$apt_rk" | tail -n 40 | tee -a "$REPORT"
      else
        echo "正常" | tee -a "$REPORT"
      fi
    fi
    local rk_update rk_check
    rk_update=$(rkhunter --update 2>&1) || true
    emit_section "rkhunter 规则更新"
    if echo "$rk_update" | grep -qiE 'error|failed|warning.*fail'; then
      printf '%s\n' "$rk_update" | tail -n 30 | tee -a "$REPORT"
    else
      echo "正常" | tee -a "$REPORT"
    fi
    rk_check=$(rkhunter --check --sk --report-warnings-only --nocolors 2>&1 || true)
    emit_check_result "rkhunter 扫描结果" "$rk_check"
  fi

  if ! has_check "clamav" && ! has_check "rkhunter"; then
    emit_section "杀毒/Rootkit 扫描"
    echo "正常（本次未勾选 clamav / rkhunter 模块）" | tee -a "$REPORT"
  fi

  emit_section "结论"
  echo "说明: 上文中标记为「正常」表示按当前规则未发现疑点；有输出内容时请结合业务人工复核。" | tee -a "$REPORT"

  echo
  echo "检查完成。报告路径: $REPORT"
}

main "$@"
