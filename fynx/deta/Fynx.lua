if not _G.FynxNotify then
    _G.FynxNotify = {}
    local Players = game:GetService("Players")
    local RunService = game:GetService("RunService")
    local LocalPlayer = Players.LocalPlayer

    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "FynxNotify"
    ScreenGui.ResetOnSpawn = false
    ScreenGui.Parent = LocalPlayer:WaitForChild("PlayerGui")

    local NotificationFolder = Instance.new("Folder")
    NotificationFolder.Name = "Notifications"
    NotificationFolder.Parent = ScreenGui

    function _G.FynxNotify:Notify(opts)
        local title = opts.Title or "Notification"
        local text = opts.Text or ""
        local duration = opts.Duration or 3
        local actionText = opts.ActionText
        local callback = opts.Callback

        local Frame = Instance.new("Frame")
        Frame.Size = UDim2.new(0, 300, 0, 80)
        Frame.Position = UDim2.new(0.5, -150, 1, 100)
        Frame.BackgroundColor3 = Color3.fromRGB(30, 34, 54)
        Frame.AnchorPoint = Vector2.new(0.5, 1)
        Frame.Parent = NotificationFolder
        Frame.ClipsDescendants = true
        Frame.ZIndex = 10

        local UIStroke = Instance.new("UIStroke", Frame)
        UIStroke.Color = Color3.fromRGB(255, 79, 79)
        UIStroke.Thickness = 2

        local UIListLayout = Instance.new("UIListLayout", Frame)
        UIListLayout.SortOrder = Enum.SortOrder.LayoutOrder
        UIListLayout.Padding = UDim.new(0, 5)

        local TitleLabel = Instance.new("TextLabel")
        TitleLabel.Size = UDim2.new(1, -10, 0, 25)
        TitleLabel.Position = UDim2.new(0, 5, 0, 5)
        TitleLabel.BackgroundTransparency = 1
        TitleLabel.Text = title
        TitleLabel.TextColor3 = Color3.fromRGB(229, 231, 255)
        TitleLabel.Font = Enum.Font.GothamBold
        TitleLabel.TextSize = 18
        TitleLabel.Parent = Frame

        local TextLabel = Instance.new("TextLabel")
        TextLabel.Size = UDim2.new(1, -10, 0, 40)
        TextLabel.Position = UDim2.new(0, 5, 0, 30)
        TextLabel.BackgroundTransparency = 1
        TextLabel.Text = text
        TextLabel.TextColor3 = Color3.fromRGB(138, 143, 191)
        TextLabel.Font = Enum.Font.Gotham
        TextLabel.TextSize = 14
        TextLabel.TextWrapped = true
        TextLabel.Parent = Frame

        if actionText and callback then
            local ActionBtn = Instance.new("TextButton")
            ActionBtn.Size = UDim2.new(0, 80, 0, 25)
            ActionBtn.Position = UDim2.new(1, -85, 1, -30)
            ActionBtn.AnchorPoint = Vector2.new(1, 1)
            ActionBtn.BackgroundColor3 = Color3.fromRGB(255, 79, 79)
            ActionBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
            ActionBtn.Font = Enum.Font.Gotham
            ActionBtn.TextSize = 14
            ActionBtn.Text = actionText
            ActionBtn.Parent = Frame
            ActionBtn.MouseButton1Click:Connect(callback)
        end

        local tweenService = game:GetService("TweenService")
        local goal = {Position = UDim2.new(0.5, -150, 1, -10)}
        local tween = tweenService:Create(Frame, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), goal)
        tween:Play()

        task.delay(duration, function()
            local goalOut = {Position = UDim2.new(0.5, -150, 1, 100)}
            local tweenOut = tweenService:Create(Frame, TweenInfo.new(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.In), goalOut)
            tweenOut:Play()
            tweenOut.Completed:Connect(function()
                Frame:Destroy()
            end)
        end)
    end

    function _G.FynxNotify:Success(title, text, duration)
        self:Notify({
            Title = title or "Success",
            Text = text or "",
            Duration = duration or 3
        })
    end
end