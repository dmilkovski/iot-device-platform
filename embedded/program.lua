function LoadConfig()
    s = {ssid="", pass="", token="", server="", port=""}
    if (file.open("sc.txt","r")) then
        local sF = file.read()
        --print("setting: "..sF)
        file.close()
        for k, v in string.gmatch(sF, "([%w.]+)=([%S ]+)") do    
            s[k] = v
--            print(k .. ": " .. v)
        end
    end
end

LoadConfig()
wifi.setmode(wifi.STATION)
wifi.sta.config(s.ssid, s.pass)
wifi.sta.connect()

local maxAttempts = 20
local attempts = 0

tmr.alarm(0, 1000, 1, function ()
    if (wifi.sta.getip() == nil) and attempts < maxAttempts then
        --print('Trying to connect to AP: '..SSID)
        attempts = attempts + 1
    else
        tmr.stop(0)
        if (attempts < 20) then
            --print("IP obtained "..wifi.sta.getip())
            dofile("main.lua")
           return
        else
           ---Setup server to confing wifi connection
           dofile("server.lua")
           return
        end
        attempts = nil; maxAttempts = nil;
    end
end)

