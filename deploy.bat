@echo off
:: 设置命令行编码为 UTF-8，防止中文路径或文件夹名乱码
chcp 65001 >nul

echo ====================================================
echo          Hugo 博客自动提交脚本 (智能文件夹识别)
echo ====================================================

:: 【核心逻辑】自动获取 content/post/ 目录下最新创建/修改的文件夹名称
set "LATEST_POST_DIR=Update blog"
if exist "content\post" (
    for /f "delims=" %%i in ('dir "content\post" /ad /od /b 2^>nul') do (
        set "LATEST_POST_DIR=%%i"
    )
)

:: 1. 提示用户输入提交说明，并把自动识别到的文件夹名字展示出来
echo 智能识别到最新文章文件夹: [%LATEST_POST_DIR%]
set /p msg="请输入本次提交说明 (直接回车默认使用文章文件夹名): "

:: 2. 如果用户直接按了回车没输入，则使用自动提取的文件夹名作为提交说明
if "%msg%"=="" (
    set "msg=Auto update: %LATEST_POST_DIR%"
)

echo.
echo 开始执行 Git 提交...
echo ----------------------------------------------------
echo 最终提交说明: "%msg%"
echo.

:: 3. 依次执行 git 命令
echo [1/3] 正在添加文件 (git add .)
git add .

echo [2/3] 正在本地提交 (git commit)
git commit -m "%msg%"

echo [3/3] 正在推送到远程仓库 (git push)
git push

echo ----------------------------------------------------
echo 恭喜！博客已成功更新并推送完成！
echo ====================================================

:: 保持窗口打开，方便查看输出结果
pause