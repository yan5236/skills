"""规范驱动开发脚手架脚本。

该脚本用于在目标项目中创建 `specs/` 目录结构、复制模板文件，
并为指定功能生成 `requirements.md`、`design.md`、`tasks.md` 三件套。
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path


TEMPLATE_FILES = ("requirements.md", "design.md", "tasks.md")


def parse_args() -> argparse.Namespace:
    """解析命令行参数并返回标准化结果。

    该函数负责定义脚本的输入契约，包括目标项目根目录、功能名称、
    功能目录 slug、可选的编号以及是否强制覆盖已有文件。
    通过集中解析参数，可以让后续业务逻辑只处理已校验的输入数据。
    """

    parser = argparse.ArgumentParser(
        description="为目标项目创建规范驱动开发目录与三份文档模板。"
    )
    parser.add_argument(
        "--project-root",
        required=True,
        help="目标项目根目录，脚本会在该目录下创建 specs 结构。",
    )
    parser.add_argument(
        "--feature-name",
        required=True,
        help="功能名称，用于填充三个 Markdown 文件中的标题占位符。",
    )
    parser.add_argument(
        "--feature-slug",
        required=True,
        help="功能目录 slug，例如 login-feature。",
    )
    parser.add_argument(
        "--sequence",
        help="三位编号，可选；未提供时自动根据现有目录推导下一个编号。",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="覆盖已存在的模板文件与功能文档。",
    )
    return parser.parse_args()


def get_skill_root() -> Path:
    """返回当前技能目录的根路径。

    脚本固定放在 `skill/scripts/` 目录中，因此可以通过当前文件路径
    反推出技能根目录，并基于该根目录定位 `assets/` 中的模板文件。
    """

    return Path(__file__).resolve().parent.parent


def validate_slug(feature_slug: str) -> str:
    """校验并返回合法的功能目录 slug。

    规范目录要求使用稳定、可读的短横线命名，因此该函数会检查输入
    是否只包含小写字母、数字与中划线。若不符合规则，直接抛出异常，
    避免生成不一致的目录结构。
    """

    if not re.fullmatch(r"[a-z0-9-]+", feature_slug):
        raise ValueError("feature-slug 只能包含小写字母、数字和中划线。")
    return feature_slug


def resolve_sequence(specs_dir: Path, sequence: str | None) -> str:
    """计算当前功能目录应使用的三位编号。

    当调用方显式传入 `--sequence` 时，函数会校验其是否为三位数字；
    否则会扫描现有 `specs/` 目录下的功能文件夹，自动生成下一个可用编号。
    这样可以保证新建目录的编号连续且格式统一。
    """

    if sequence is not None:
        if not re.fullmatch(r"\d{3}", sequence):
            raise ValueError("sequence 必须是三位数字，例如 001。")
        return sequence

    max_sequence = 0
    if specs_dir.exists():
        for child in specs_dir.iterdir():
            if not child.is_dir() or child.name == ".templates":
                continue
            match = re.match(r"^(\d{3})-", child.name)
            if match:
                max_sequence = max(max_sequence, int(match.group(1)))
    return f"{max_sequence + 1:03d}"


def read_template(template_path: Path) -> str:
    """以 UTF-8 编码读取模板文件内容。

    模板文件由技能自身维护，统一要求使用 UTF-8 无 BOM。该函数显式
    指定编码，避免在 Windows 环境下回退到系统默认编码后出现乱码。
    """

    return template_path.read_text(encoding="utf-8")


def write_utf8_file(target_path: Path, content: str, force: bool) -> None:
    """以 UTF-8 无 BOM 方式写入文本文件。

    该函数统一处理目录创建、覆盖控制与换行规范，确保脚本生成的
    Markdown 文件不会因为编码或 BOM 问题影响后续工具链处理。
    """

    if target_path.exists() and not force:
        return

    target_path.parent.mkdir(parents=True, exist_ok=True)
    with target_path.open("w", encoding="utf-8", newline="\n") as file:
        file.write(content)


def copy_template_files(skill_root: Path, templates_dir: Path, force: bool) -> None:
    """将技能内置模板复制到目标项目的 `.templates` 目录。

    复制动作使用技能 `assets/` 下的三个模板文件作为单一来源，
    保证每个项目都使用一致的模板版本。若目标文件已存在且未启用
    `--force`，则保留项目内现有模板，避免覆盖用户自定义内容。
    """

    assets_dir = skill_root / "assets"
    templates_dir.mkdir(parents=True, exist_ok=True)

    for file_name in TEMPLATE_FILES:
        template_content = read_template(assets_dir / file_name)
        write_utf8_file(templates_dir / file_name, template_content, force)


def render_feature_content(template_content: str, feature_name: str) -> str:
    """把模板中的功能名称占位符替换为当前功能名称。

    模板中的 `[功能名称]` 用于表达待填充的位置。该函数在创建具体功能
    文档时完成替换，使新建文档从一开始就带有明确的功能标题。
    """

    return template_content.replace("[功能名称]", feature_name)


def create_feature_files(
    skill_root: Path,
    feature_dir: Path,
    feature_name: str,
    force: bool,
) -> None:
    """为指定功能目录生成三份初始规范文档。

    该函数基于技能模板创建功能级文档，并将模板占位符替换为实际功能名。
    如果目标文件已经存在且未启用覆盖，则保留现有内容，避免误伤正在编辑
    的规范文档。
    """

    assets_dir = skill_root / "assets"
    feature_dir.mkdir(parents=True, exist_ok=True)

    for file_name in TEMPLATE_FILES:
        template_content = read_template(assets_dir / file_name)
        feature_content = render_feature_content(template_content, feature_name)
        write_utf8_file(feature_dir / file_name, feature_content, force)


def main() -> None:
    """执行脚手架创建流程并输出结果路径。

    主函数负责串联参数解析、输入校验、模板复制与功能目录生成，
    最终把创建结果打印到标准输出，方便调用方在终端中直接查看
    已生成的目录与文件位置。
    """

    args = parse_args()
    project_root = Path(args.project_root).resolve()
    skill_root = get_skill_root()
    feature_slug = validate_slug(args.feature_slug)

    specs_dir = project_root / "specs"
    templates_dir = specs_dir / ".templates"
    sequence = resolve_sequence(specs_dir, args.sequence)
    feature_dir = specs_dir / f"{sequence}-{feature_slug}"

    copy_template_files(skill_root, templates_dir, args.force)
    create_feature_files(skill_root, feature_dir, args.feature_name, args.force)

    print(f"specs_dir={specs_dir}")
    print(f"templates_dir={templates_dir}")
    print(f"feature_dir={feature_dir}")


if __name__ == "__main__":
    main()
