local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local LocalPlayer = Players.LocalPlayer

local Library = {}
Library.__index = Library

function Library:CreateWindow(config)
    if LocalPlayer.PlayerGui:FindFirstChild("Universal_UI") then
        LocalPlayer.PlayerGui.Universal_UI:Destroy()
    end

    local ScreenGui = Instance.new("ScreenGui")
    ScreenGui.Name = "Universal_UI"
    ScreenGui.ResetOnSpawn = false
    ScreenGui.Parent = LocalPlayer:WaitForChild("PlayerGui")

    local MainFrame = Instance.new("Frame")
    MainFrame.Size = UDim2.new(0, config.Width or 400, 0, config.Height or 260)
    MainFrame.Position = UDim2.new(0.5, -200, 0.5, -130)
    MainFrame.BackgroundColor3 = Color3.fromRGB(15,15,15)
    MainFrame.BorderSizePixel = 0
    MainFrame.Parent = ScreenGui

    local UICorner = Instance.new("UICorner")
    UICorner.CornerRadius = UDim.new(0,20)
    UICorner.Parent = MainFrame

    local Title = Instance.new("TextLabel")
    Title.Size = UDim2.new(1,0,0,40)
    Title.Text = config.Title or "Universal UI"
    Title.TextColor3 = Color3.fromRGB(220,220,220)
    Title.BackgroundColor3 = Color3.fromRGB(30,30,30)
    Title.Font = Enum.Font.Gotham
    Title.TextSize = 22
    Title.Parent = MainFrame

    local TitleCorner = Instance.new("UICorner")
    TitleCorner.CornerRadius = UDim.new(0,20)
    TitleCorner.Parent = Title

    local TabBar = Instance.new("Frame")
    TabBar.Size = UDim2.new(0,120,1,-40)
    TabBar.Position = UDim2.new(0,0,0,40)
    TabBar.BackgroundColor3 = Color3.fromRGB(20,20,20)
    TabBar.Parent = MainFrame

    local TabCorner = Instance.new("UICorner")
    TabCorner.CornerRadius = UDim.new(0,15)
    TabCorner.Parent = TabBar

    local Container = Instance.new("Frame")
    Container.Size = UDim2.new(1,-120,1,-40)
    Container.Position = UDim2.new(0,120,0,40)
    Container.BackgroundColor3 = Color3.fromRGB(25,25,25)
    Container.Parent = MainFrame

    local ContainerCorner = Instance.new("UICorner")
    ContainerCorner.CornerRadius = UDim.new(0,15)
    ContainerCorner.Parent = Container

    local dragging, dragInput, dragStart, startPos
    local function update(input)
        local delta = input.Position - dragStart
        MainFrame.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset+delta.X, startPos.Y.Scale, startPos.Y.Offset+delta.Y)
    end
    MainFrame.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = true
            dragStart = input.Position
            startPos = MainFrame.Position
            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    dragging = false
                end
            end)
        end
    end)
    MainFrame.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseMovement then
            dragInput = input
        end
    end)
    UserInputService.InputChanged:Connect(function(input)
        if input == dragInput and dragging then
            update(input)
        end
    end)

    local Window = setmetatable({
        ScreenGui = ScreenGui,
        MainFrame = MainFrame,
        TabBar = TabBar,
        Container = Container,
        Tabs = {}
    }, Library)

    return Window
end

function Library:CreateTab(config)
    local Button = Instance.new("TextButton")
    Button.Size = UDim2.new(1,0,0,35)
    Button.Text = config.Text or "Tab"
    Button.BackgroundColor3 = Color3.fromRGB(45,45,45)
    Button.TextColor3 = Color3.fromRGB(220,220,220)
    Button.Font = Enum.Font.Gotham
    Button.TextSize = 18
    Button.Parent = self.TabBar

    local UICorner = Instance.new("UICorner")
    UICorner.CornerRadius = UDim.new(0,10)
    UICorner.Parent = Button

    local Page = Instance.new("ScrollingFrame")
    Page.Size = UDim2.new(1,0,1,0)
    Page.BackgroundTransparency = 1
    Page.Visible = false
    Page.CanvasSize = UDim2.new(0,0,5,0)
    Page.ScrollBarThickness = 4
    Page.Parent = self.Container

    local Tab = {
        Button = Button,
        Page = Page,
        YOffset = 0.05
    }
    table.insert(self.Tabs, Tab)

    Button.MouseButton1Click:Connect(function()
        for _,t in pairs(self.Tabs) do
            t.Page.Visible = false
            t.Button.BackgroundColor3 = Color3.fromRGB(45,45,45)
        end
        Page.Visible = true
        Button.BackgroundColor3 = Color3.fromRGB(70,70,70)
    end)

    if #self.Tabs == 1 then
        Page.Visible = true
        Button.BackgroundColor3 = Color3.fromRGB(70,70,70)
    end

    return setmetatable(Tab, {__index = Library})
end

function Library:AddButton(config)
    local Button = Instance.new("TextButton")
    Button.Size = UDim2.new(0.9,0,0,35)
    Button.Position = UDim2.new(0.05,0,self.YOffset,0)
    Button.Text = config.Text or "Button"
    Button.BackgroundColor3 = Color3.fromRGB(45,45,45)
    Button.TextColor3 = Color3.fromRGB(220,220,220)
    Button.Font = Enum.Font.Gotham
    Button.TextSize = 18
    Button.Parent = self.Page

    local UICorner = Instance.new("UICorner")
    UICorner.CornerRadius = UDim.new(0,10)
    UICorner.Parent = Button

    if config.Callback then
        Button.MouseButton1Click:Connect(config.Callback)
    end

    self.YOffset = 0.1
    return Button
end

function Library:AddLabel(text)
    local Label = Instance.new("TextLabel")
    Label.Size = UDim2.new(0.9,0,0,30)
    Label.Position = UDim2.new(0.05,0,self.YOffset,0)
    Label.Text = text or "Label"
    Label.BackgroundColor3 = Color3.fromRGB(30,30,30)
    Label.TextColor3 = Color3.fromRGB(220,220,220)
    Label.Font = Enum.Font.Gotham
    Label.TextSize = 18
    Label.Parent = self.Page

    local UICorner = Instance.new("UICorner")
    UICorner.CornerRadius = UDim.new(0,10)
    UICorner.Parent = Label

    self.YOffset = 0.1
    return Label
end

function Library:AddToggle(config)
    local Button = Instance.new("TextButton")
    Button.Size = UDim2.new(0.9,0,0,35)
    Button.Position = UDim2.new(0.05,0,self.YOffset,0)
    Button.Text = "[ OFF ] "..(config.Text or "Toggle")
    Button.BackgroundColor3 = Color3.fromRGB(45,45,45)
    Button.TextColor3 = Color3.fromRGB(220,220,220)
    Button.Font = Enum.Font.Gotham
    Button.TextSize = 18
    Button.Parent = self.Page

    local UICorner = Instance.new("UICorner")
    UICorner.CornerRadius = UDim.new(0,10)
    UICorner.Parent = Button

    local state = false
    Button.MouseButton1Click:Connect(function()
        state = not state
        Button.Text = (state and "[ ON ] " or "[ OFF ] ")..(config.Text or "Toggle")
        if config.Callback then config.Callback(state) end
    end)

    self.YOffset = 0.1
    return Button
end

function Library:AddTextbox(config)
    local Box = Instance.new("TextBox")
    Box.Size = UDim2.new(0.9,0,0,35)
    Box.Position = UDim2.new(0.05,0,self.YOffset,0)
    Box.PlaceholderText = config.Placeholder or "Enter text..."
    Box.BackgroundColor3 = Color3.fromRGB(30,30,30)
    Box.TextColor3 = Color3.fromRGB(220,220,220)
    Box.Font = Enum.Font.Gotham
    Box.TextSize = 18
    Box.ClearTextOnFocus = false
    Box.Parent = self.Page

    local UICorner = Instance.new("UICorner")
    UICorner.CornerRadius = UDim.new(0,10)
    UICorner.Parent = Box

    Box.FocusLost:Connect(function(enterPressed)
        if enterPressed and config.Callback then
            config.Callback(Box.Text)
        end
    end)

    self.YOffset = 0.1
    return Box
end

return Library