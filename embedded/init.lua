local IDLE_AT_STARTUP_MS = 10000; --20000
--print("Program will start after: "..string.format("%s", IDLE_AT_STARTUP_MS).." ms.");
tmr.alarm(1,IDLE_AT_STARTUP_MS,0,function()
    dofile("program.lua")
end)