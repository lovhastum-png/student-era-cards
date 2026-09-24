' Student Era Cards - standalone launcher (ASCII only, encoding-safe)
' Opens the game html in a chromeless Edge app window with its own profile.
' The file URL is percent-encoded (Edge fails on raw non-ASCII in the URL).

' percent-encode a string (UTF-8 bytes), keeping ASCII letters/digits and / : . - _
Function UrlEncode(s)
  Dim st, i, b, out
  Set st = CreateObject("ADODB.Stream")
  st.Type = 2
  st.Charset = "utf-8"
  st.Open
  st.WriteText s
  st.Position = 0
  st.Type = 1
  Dim bytes
  bytes = st.Read
  st.Close
  out = ""
  start = 1
  ' skip UTF-8 BOM (EF BB BF) written by the stream
  If LenB(bytes) >= 3 And AscB(MidB(bytes, 1, 1)) = 239 And AscB(MidB(bytes, 2, 1)) = 187 And AscB(MidB(bytes, 3, 1)) = 191 Then start = 4
  For i = start To LenB(bytes)
    b = AscB(MidB(bytes, i, 1))
    If (b >= 65 And b <= 90) Or (b >= 97 And b <= 122) Or (b >= 48 And b <= 57) _
       Or b = 47 Or b = 58 Or b = 46 Or b = 45 Or b = 95 Then
      out = out & Chr(b)
    Else
      out = out & "%" & Right("0" & Hex(b), 2)
    End If
  Next
  UrlEncode = out
End Function

Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
dir = fso.GetParentFolderName(WScript.ScriptFullName)

' always open the game, not the standalone editor
html = "学生时代牌-网页版.html"
If html = "" Then
  MsgBox "Game file not found in:" & vbCrLf & dir, 48, "Student Era Cards"
  WScript.Quit 1
End If

' locate msedge.exe
edge = sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Microsoft\Edge\Application\msedge.exe"
If Not fso.FileExists(edge) Then
  edge = sh.ExpandEnvironmentStrings("%ProgramFiles%") & "\Microsoft\Edge\Application\msedge.exe"
End If

' dedicated profile under LocalAppData (kept out of the game folder)
profile = sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\StudentEraCardsEdge"
url = "file:///" & UrlEncode(Replace(dir, "\", "/") & "/" & html)
sh.Run """" & edge & """ --app=""" & url & """ --user-data-dir=""" & profile & """ --window-size=1280,800 --no-first-run --no-default-browser-check", 0, False
