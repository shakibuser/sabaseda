param(
  [Parameter(Mandatory=$true)]
  [string]$Slug,

  [Parameter(Mandatory=$true)]
  [string]$Title,

  [Parameter(Mandatory=$true)]
  [string]$Summary,

  [string]$Category = "اجتماعی",

  [string]$PublishedAt = ""
)

$ErrorActionPreference = "Stop"
$Project = "G:\sabaseda\sabaseda"
$ContentDir = Join-Path $Project "src\content\news"

if ([string]::IsNullOrWhiteSpace($PublishedAt)) {
  $PublishedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:sszzz")
}

$file = Join-Path $ContentDir "$Slug.md"

if (Test-Path -LiteralPath $file) {
  throw "خبر با این slug از قبل وجود دارد: $Slug"
}

$content = @"
---
title: "$Title"
summary: "$Summary"
category: "$Category"
publishedAt: "$PublishedAt"
image: "/images/saba-news-sample.svg"
imageAlt: "تصویر خبر"
featured: false
---

## متن خبر

متن خبر را اینجا بنویس.

## جزئیات

جزئیات تکمیلی خبر را اینجا اضافه کن.
"@

[System.IO.File]::WriteAllText(
  $file,
  $content,
  [System.Text.UTF8Encoding]::new($false)
)

Write-Host ""
Write-Host "News draft created successfully." -ForegroundColor Green
Write-Host "File: $file"
Write-Host ""
Write-Host "Edit the Markdown file, save it, then refresh the Astro site."
