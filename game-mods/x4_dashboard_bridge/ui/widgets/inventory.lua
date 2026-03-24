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
    local ffi = require("ffi")
    local C = ffi.C

    pcall(ffi.cdef, [[
        typedef uint64_t UniverseID;
        UniverseID GetPlayerOccupiedShipID(void);
    ]])

    local shipId = tonumber(C.GetPlayerOccupiedShipID()) or 0
    local rawInventory = {}
    
    if shipId ~= 0 then
        local categories = { "container", "solid", "liquid" }
        
        for _, cat in ipairs(categories) do
            local catData = GetUnitStorageData(shipId, cat) or {}
            if type(catData) == "table" then
                for ware, amount in pairs(catData) do
                    if type(amount) == "number" and amount > 0 then
                        rawInventory[ware] = amount
                    elseif type(amount) == "table" and amount.amount then
                        local a = tonumber(amount.amount) or 0
                        if a > 0 then
                            rawInventory[ware] = a
                        end
                    end
                end
            end
        end
        
        if not rawInventory or next(rawInventory) == nil then
            local cargoTable = GetComponentData(shipId, "cargo") or {}
            if type(cargoTable) == "table" then
                for ware, amount in pairs(cargoTable) do
                    if type(amount) == "number" and amount > 0 then
                        rawInventory[ware] = amount
                    end
                end
            end
        end
    end
    
    if not rawInventory or next(rawInventory) == nil then
        local playerInv = GetPlayerInventory() or {}
        for ware, amount in pairs(playerInv) do
            if type(amount) == "table" then
                local a = tonumber(amount.amount) or 0
                if a > 0 then
                    rawInventory[ware] = a
                end
            elseif type(amount) == "number" and amount > 0 then
                rawInventory[ware] = amount
            end
        end
    end
    
    local playerZone = GetPlayerContextByClass("zone")
    local policeFaction = playerZone and GetComponentData(playerZone, "policefaction") or nil
    local list = {}

    for ware, wareData in pairs(rawInventory) do
        local category = getCategory(ware)
        if not category then
            category = { id = "cargo", name = "Cargo" }
        end

        local amount = 0
        if type(wareData) == "number" then
            amount = tonumber(wareData) or 0
        elseif type(wareData) == "table" then
            amount = tonumber(wareData.amount) or 0
        end

        if amount > 0 then
            table.insert(list, {
                id = ware,
                name = GetWareData(ware, "name") or ware,
                amount = amount,
                category = category,
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
        timestamp = C.GetCurrentGameTime(),
        list = list,
    }
end

return output
