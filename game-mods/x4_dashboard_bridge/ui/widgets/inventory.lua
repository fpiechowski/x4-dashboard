local output = {}

local function getCategory(ware)
    local iscraftingresource, ismodpart, isprimarymodpart, ispersonalupgrade, tradeonly, ispaintmod, isbraneitem =
        GetWareData(ware, "iscraftingresource", "ismodpart", "isprimarymodpart", "ispersonalupgrade", "tradeonly", "ispaintmod", "isbraneitem")

    if iscraftingresource or ismodpart or isprimarymodpart then
        return { id = "crafting", name = ReadText(1001, 2827) }
    elseif ispersonalupgrade then
        return nil
    elseif tradeonly then
        return { id = "tradeonly", name = ReadText(1001, 2829) }
    elseif ispaintmod then
        return { id = "paintmod", name = ReadText(1001, 8510) }
    elseif not isbraneitem then
        return { id = "useful", name = ReadText(1001, 2828) }
    end

    return nil
end

function output.handle()
    local playerZone = GetPlayerContextByClass("zone")
    local policeFaction = playerZone and GetComponentData(playerZone, "policefaction") or nil
    local rawInventory = GetPlayerInventory() or {}
    local list = {}

    for ware, wareData in pairs(rawInventory) do
        local category = getCategory(ware)

        if category then
            local amount = tonumber(wareData.amount) or 0

            table.insert(list, {
                id = ware,
                name = GetWareData(ware, "name") or ware,
                amount = amount,
                category = category,
                price = tonumber(wareData.price) or nil,
                illegal = policeFaction and IsWareIllegalTo(ware, "player", policeFaction) or false,
            })
        end
    end

    table.sort(list, function(a, b)
        local aCategory = a.category and a.category.name or ""
        local bCategory = b.category and b.category.name or ""

        if aCategory ~= bCategory then
            return aCategory < bCategory
        end

        return a.name < b.name
    end)

    return {
        list = list,
    }
end

return output
