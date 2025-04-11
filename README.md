FormattedLabel = 
VAR Bullet = 
    SWITCH(
        [RegionCode],
        "AFR", UNICHAR(128308), // 🔴 red
        "SAR", UNICHAR(128309), // 🔵 blue
        "EAP", UNICHAR(128994), // 🟢 green
        "ECA", UNICHAR(128993), // 🟡 yellow
        "LAC", UNICHAR(128992), // 🟠 orange
        "MENA", UNICHAR(128996) // 🔴 dark red
    )
RETURN
Bullet & " " & [RegionCode] & " - " & [GrantCount] & UNICHAR(10) & [RegionName]
