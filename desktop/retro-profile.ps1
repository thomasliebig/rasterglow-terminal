[Console]::InputEncoding = [Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
$OutputEncoding = [Text.UTF8Encoding]::new($false)
$PSDefaultParameterValues['Get-Content:Encoding'] = 'utf8'
chcp 65001 > $null

$psReadLine = Get-Command Set-PSReadLineOption -ErrorAction SilentlyContinue
if ($psReadLine -and $psReadLine.Parameters.ContainsKey('PredictionSource')) {
    Set-PSReadLineOption -PredictionSource None
}

# VT-safe replacement for legacy more.com. It never reads or rewrites the
# Windows console screen buffer, so every source line reaches xterm exactly
# once and remains compatible with UTF-8 box-drawing output.
function global:more {
    [CmdletBinding()]
    param([Parameter(ValueFromPipeline = $true)] $InputObject)

    begin {
        $pagerLines = [Collections.Generic.List[string]]::new()
    }
    process {
        if ($null -eq $InputObject) {
            $pagerLines.Add('')
        } else {
            foreach ($part in ([string]$InputObject -split "`r?`n")) {
                $pagerLines.Add($part)
            }
        }
    }
    end {
        $pageHeight = [Math]::Max(4, $Host.UI.RawUI.WindowSize.Height - 2)
        $shown = 0
        for ($lineIndex = 0; $lineIndex -lt $pagerLines.Count; $lineIndex++) {
            $line = $pagerLines[$lineIndex]
            [Console]::Out.WriteLine($line)
            $shown++
            if ($shown -ge $pageHeight -and $lineIndex -lt $pagerLines.Count - 1) {
                $prompt = '-- MORE --  SPACE: page  ENTER: line  Q: quit'
                [Console]::Out.Write($prompt)
                do { $key = [Console]::ReadKey($true) } while ($key.Key -notin @('Spacebar', 'Enter', 'Q'))
                [Console]::Out.Write("`r" + (' ' * $prompt.Length) + "`r")
                if ($key.Key -eq 'Q') { break }
                $shown = if ($key.Key -eq 'Enter') { $pageHeight - 1 } else { 0 }
            }
        }
    }
}
