if jumpscare_jeffwuz_loaded and not _G.jumpscarefucking123 == true then
warn("Already Loading")
return
end

pcall(function() getgenv().jumpscare_jeffwuz_loaded = true end)

if not getcustomasset then
game:Shutdown() 
end

local player = game:GetService("Players").LocalPlayer
local HttpService = game:GetService('HttpService')

local ScreenGui = Instance.new("ScreenGui")
local VideoScreen = Instance.new("VideoFrame")
ScreenGui.Parent = game:GetService("CoreGui")
ScreenGui.IgnoreGuiInset = true
ScreenGui.Name = "JeffTheKillerWuzHere"

VideoScreen.Parent = ScreenGui
VideoScreen.Size = UDim2.new(1,0,1,0)

writefile("face.mp4", game:HttpGet("https://github.com/xStrikea/xStrikea.github.io/blob/main/scripthub/face.mp4?raw=yes"))

VideoScreen.Video = getcustomasset("face.mp4")

VideoScreen.Looped = true
VideoScreen.Playing = true
VideoScreen.Volume = 10

