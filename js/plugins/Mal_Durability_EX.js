//=============================================================================
// Maliki's Item Durability EX
// Mal_Durability_EX.js
// version 1.9
//=============================================================================
/*:  
* @plugindesc This plugin gives extra functionality to YanFly's ItemDurability Plugin
 * @author Maliki79
 * @param DestroyEquipMode
 * @desc 0 = destroy item. 1 = no destroy. 2 = becomes unequippable.
 * Default: 1
 * @default 1
 *
 * @param DurabilityAdjust
 * @desc Percentage of durability an equip must be reduced to before it's stats are affected.
 * Default: 50
 * @default 50
 *
 * @param DurabilityReverseEdge
 * @desc Set to 1 to make durability percentage INCREASE stats rather than decrease them.
 * Default: 0
 * @default 0
 *
 * @help Version 1.9
 * You will need YanFly's ItemDurability Plugin as well as any supporting Plugins.
 * Place this plugin right under the ItemDurability one.
 *
 * This plugin is plug-and-play with 2 parameters to customize it for your project.
 *
 * Destroy Equip Mode:
 * This setting dictates what happens to equips once their durability hits 0.
 *
 * Type 0 will use Yanfly's original design and destroy the item, removing
 * it from the actor and inventory permanently.
 *
 * Type 1 will keep the equip with no other changes.
 *
 * Type 2 will unequip the item upon break and render it
 * unequippable until repaired.
 *
 *
 * Durability Adjust:
 * Durability now affects the stats of items while equipped.
 * This is done via a direct percentage change
 * based on current durability.
 * So, if Max durability is set to 200 and and item with 500 attack
 * has durability of 100, the attack stat would 1ower to 250.  
 * (50% durability = 50% stat reduction)
 * Of course, this means that a 0 durability item would give no stat boosts at all.
 * (Percentage and trait based boosts will still be active.)
 *
 * You can set when the stats begin to get affected by using the
 * Durability Adjust Param.
 * Setting it to 100 would make any change in durability
 * immediately affect that equipment's stats.
 * Setting it to 0 would see no change to stats until
 * the item breaks.
 * Note that the percentage of the stat change itself is fixed.
 * Also note that the percentage is based on the MAX durability of the
 * item, not it's STARTING durability.
 *
 * So revisiting the above example, if the durability adjust was set at 20,
 * the above equip would still have 500 attack even though the
 * durability is at 100.
 * However, if the durability were to drop to 40, the
 * stats would change to 100!  (20% of 500)
 *
 * However, using the Plugin Param DurabilityReverseEdge will reverse this, so that reduced
 * Durability will instead INCREASE stats by the percentage!
 * You can also use the notetag <dReverseEdge> on equips to do this on a per equip basis.
 *
 * Some Script Calls were also added.
 *
 * $gameParty.totalDurability();
 * This call totals the amount of durability present for each equip item in
 * both the party equips AND inventory and returns the value.
 * It does not count Unbreakable items.
 *
 * $gameParty.totalDurability(true);
 * This call totals the MAX durability present for each equip item in both
 * the party equips AND inventory and returns the value.
 * It does not count Unbreakable items.
 *
 * $gameParty.fixAllDurability();
 * This call resets each item's durability to it's max value.
 *
 * $gameParty.fixAllDurability(amount);
 * This call changes each item's durability by the percentage amount.
 * For example, $gameParty.fixAllDurability(25); will increase ALL item durability
 * by 25% of thier MAX value.  
 * (Negative numbers will cause damage and can break items)
 *
 * The basic use I saw for these calls was to enable a "Blacksmith"
 * that can charge a certain amount based on current durability.
 * You can use the script calls to put these values into
 * variables for general purpose use.
 * The percentage call can be used to either rapair items over time, or make
 * "Acid pools" which can damage durability over time.
 *
 * $gameParty.changeItemDurability(type, id, amount);
 * With type being either "weapon" or "armor", id being the item's Id
 * and amount being the change value(must be negative to damage).
 * Example: $gameParty.changeItemDurability("weapon", $gameParty.members()[0]._equips[0]._itemId, -300);
 * This will give 300 durability damage to whatever weapon is
 * in the 1st party member's first equip slot.
 * (You can kinda consider this call a Lunatic Call, since you'd
 * likely need some scripting know-how to find the Id you need.)
 *
 * Game_Actor.isWeaponBroken(type);
 * Game_Actor.isArmorBroken(type);
 * With type being the appropriate equipment type ID.
 * Will check to see if an equip type is broken and will return true if one is found.
 * For weapons, it will check both weapon slots and for armors, all armor slots.
 * (Will check slot 1 for both)
 * This can be used for conditionals for things like passive states, etc.
 *
 * Element effects:
 * Durability can now be affected by elements!
 * To utilize this, use the following tag on equipment items:
 *
 * <DurabilityElement: x y >
 *
 * with x being the element Id from the database and y being a
 * number multiplier. (Note the space near the end)
 * So, assuming each hit with a weapon normally does
 * 50 durability damage, having the tag
 * <DurabilityElement: 1 0.5 >
 * will cause each hit to instead do 75. (50 + 50% = 75)
 *
 * <DurabilityElement: 1 -1 >
 *
 * This tag, on the other hand, will negate any
 * durability damage to the weapon.
 *
 * <DurabilityElement: 2 1000000 > (Or some other crazy number)
 *
 * This tag will make fire attacks (default element 2) do 1,000,000
 * times the durability damage, very likely destroying the item.
 *
 * You can have multiple element tags and the applicable
 * multipliers will be added before applying it to the damage.
 * (And yes, negative numbers lower than -1 WILL heal the
 * item's durability if the item is affected.)
 *
 * Other Tags:
 * You can tag an equip with <NoBattleDD> to make it so equips
 * will not suffer any durability damage (or healing) in battle but can
 * still be affected by Script calls that affect durability directly.
 * (Such as the changeItemDurability call.)
 * You can also tag Actor, class or states with this tag and it will protect ALL equips on that actor.
 *
 * Salvage upon Break
 * Items can now be created upon breaking of a weapon or armor!
 * Just use the notetag
 *
 * <DurabilityScrap: a, b, c, d>
 * on weapon/armor notes.
 *
 * a is the type. (1 = item. 2 = weapon. 3 = armor)
 * b is the item's id in the database.
 * c is the amount of the salvaged item.
 * d is the percentage chance from 0 to 100.
 * Note that this will work with any of the destroy modes.
 * Multiple tags can be used to give varying amounts or items if desired.
 *
 * User SPECIFIC ITEM EQUIP Durability Change
 * You can now have skills/items damage/heal specific equip types when using them.
 * Just add the following to skill or item notes:
 *
 * <UserEquipTypeDur: x, y, z>
 *
 * x being the general type (1 = weapon. 2 = armor)
 * y being the specific type Id of the equipment.
 * And z being the amount of change (negative numbers to damage).
 * This will cause ALL equipped types to take durability damage while leaving other equip types alone.
 * So if you want a spell to damage durability of a Swordmage's wand without damaging the sword she also
 * has equipped, using this tag, it is now possible.
 * Multiple versions of this tag can be used to cause different amounts of damage to different equips.
 *
 * MAX DURABILITY Changes
 *
 * Max Durability can now be changed by accessing an equip's durMax.
 * (for example, object.durmax + 50;)
 * Note that you cannot make a breakable object's durabity any number below 1.
 */
 
 
var Mal = Mal || {};
 
Mal.DurabilityParameters = PluginManager.parameters('Mal_Durability_EX');
Mal.Param = Mal.Param || {};
 
Mal.Param.DestroyEquip = Number(Mal.DurabilityParameters['DestroyEquipMode']);
Mal.Param.DestroyEquip = Mal.Param.DestroyEquip.clamp(0, 2);
 
Mal.DAdjust = Number(Mal.DurabilityParameters['DurabilityAdjust']) || 0;
Mal.DREdge = Number(Mal.DurabilityParameters['DurabilityReverseEdge']) != 0;

//begin database setup
var MalDurDatabaseLoad = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!MalDurDatabaseLoad.call(this)) return false;
  if (!DataManager._MalDur_DatabaseLoaded) {
    this.processDurNotetags($dataWeapons);
    this.processDurNotetags($dataArmors);
    this.processDurNotetags2($dataSkills);
    this.processDurNotetags2($dataItems);
	this.processDurNotetags3($dataActors);
	this.processDurNotetags3($dataClasses);
	this.processDurNotetags3($dataStates);
    DataManager._MalDur_DatabaseLoaded = true;
  }
  return true;
};
 
DataManager.processDurNotetags = function(group) {
    for (var n = 1; n < group.length; n++) {
        var obj = group[n];
        obj.durScrapData = [];
        this.createDurArray(obj);
    }
};
 
DataManager.processDurNotetags2 = function(group) {
    for (var n = 1; n < group.length; n++) {
        var obj = group[n];
        obj.userEquipDurChange = [];
        this.createDurArray2(obj);
    }
};
  
DataManager.processDurNotetags3 = function(group) {
    for (var n = 1; n < group.length; n++) {
        var obj = group[n];
		obj.noBattleDD = false;
		var noteread = obj.note;
		if (noteread.indexOf("NoBattleDD") > -1) obj.noBattleDD = true;
    }
};

DataManager.createDurArray = function(object) {
        var noteread = object.note;
 
        while(noteread.indexOf("DurabilityScrap") > -1)
        {
            var notereg = noteread.split("<DurabilityScrap: ");
            var match = notereg[1].split(", ");
            var match2 = match[3].split(">");
            object.durScrapData.push([parseInt(match[0]), parseInt(match[1]), parseInt(match[2]), parseInt(match2[0])]);
            noteread = noteread.replace("<DurabilityScrap: ", " ");
        }
    };
 
DataManager.createDurArray2 = function(object) {
        var noteread = object.note;
 
        while(noteread.indexOf("UserEquipTypeDur") > -1)
        {
            var notereg = noteread.split("<UserEquipTypeDur: ");
            var match = notereg[1].split(", ");
            var match2 = match[2].split(">");
            object.userEquipDurChange.push([parseInt(match[0]), parseInt(match[1]), parseInt(match2[0])]);
            noteread = noteread.replace("<UserEquipTypeDur: ", " ");
        }
    };
   
DataManager.getMaxDurability = function(item) {
    if (this.isItem(item)) return -1;
    if (!this.isIndependent(item)) return -1;
    var baseItem = this.getBaseItem(item);
    if (baseItem.durMax == -1) return -1;
    if (baseItem.durMax > 0 && item.durMax < 0) return 1;
    if (baseItem.durMax != item.durMax) return item.durMax;
    return baseItem.durMax;
};
//End Database Setup
 
Game_Actor.prototype.durabilityBreakScrapItem = function(obj) {
if (obj.durScrapData == []) return;
for (var i = 0; i < obj.durScrapData.length; ++i) {
    var code = obj.durScrapData[i][0];
    if (Math.randomInt(100) < obj.durScrapData[i][3]){
        if (code == 1) var item = $dataItems[obj.durScrapData[i][1]];
        if (code == 2) var item = $dataWeapons[obj.durScrapData[i][1]];
        if (code == 3) var item = $dataArmors[obj.durScrapData[i][1]];
        $gameParty.gainItem(item, obj.durScrapData[i][2]);
        var text = '\\i[' + item.iconIndex + ']' + item.name + " salvaged!";
        if (Imported.YEP_BattleEngineCore) text = '<CENTER>' + text;
        SceneManager._scene._logWindow._lines.push(text);
        SceneManager._scene._logWindow.refresh();
    }
}
};
 
Game_Actor.prototype.isWeaponBroken = function(type) {
var type = Number(type) || 0;
for (var i = 0; i < 2; i++) {
if (this.equips()[i] && this.equips()[i].wtypeId && this.equips()[i].wtypeId == type) {
    if(this.equips()[i].durability == 0) return true;
}
}
return false;
};
 
Game_Enemy.prototype.isWeaponBroken = function(type) {
return false;
};
 
Game_Actor.prototype.isArmorBroken = function(type) {
var type = Number(type) || 0;
for (var i = 1; i < 5; i++) {
if (this.equips()[i] && this.equips()[i].atypeId && this.equips()[i].atypeId == type) {
    if(this.equips()[i].durability == 0) return true;
}
}
return false;
};
 
Game_Enemy.prototype.isArmorBroken = function(type) {
return false;
};
 
var MalDuraApply = Game_Action.prototype.apply
Game_Action.prototype.apply = function(target) {
if (this.subject().isActor()) this.subject().makeElementSet(this.item());
if (target && target.isActor()) target.makeElementSet(this.item());
MalDuraApply.call(this, target);
}
 
Game_Actor.prototype.makeElementSet = function(item) {
this.lastElements = [];
this.lastElements.push(item.damage.elementId);
}
 
Game_Actor.prototype.DuraElementMul = function(note){
 
    var mul = 1;
    var objele = this.lastElements;
    var noteread = note;
    while(noteread.indexOf("DurabilityElement") > -1)
    {
        var notereg = noteread.split("<DurabilityElement: ");
        var match = notereg[1].split(" ");
        var bonuselem = Number(match[0]);
        var bonusvalue = Number(match[1]);
        noteread = noteread.replace("DurabilityElement", " ");
        for(var i = 0; i < objele.length; ++i){
        if (objele[i] == bonuselem) mul += bonusvalue;
        }
    }
    return mul;
}

Game_Actor.prototype.equipDuraProtect = function () {
	if (this.noBattleDD) return true;
	if (this.currentClass().noBattleDD) return true;
	var states = this.states();
	for (var i = 0; i < states.length; i++) {
		var id = states[i].id;
		if($dataStates[id].noBattleDD) return true;
	}
	return false;
};

Game_Actor.prototype.damageAllDurability = function(value, group) {
    if (value === 0) return;
	if (this.equipDuraProtect()) return;
    var length = group.length;
    var removed = [];
    for (var i = 0; i < length; ++i) {
      var obj = group[i];
      if (!obj) continue;
      if (!obj.baseItemId) continue;
      if (obj.durability < 1) continue;
      if (obj.meta.NoBattleDD) continue;
      obj.durability += value * this.DuraElementMul(obj.note);
	  if (obj.durability > obj.durMax) obj.durability = obj.durMax;
      if (obj.durability <= 0) {
      removed.push(obj);
      obj.durability = 0;
      }
    }
    length = removed.length;
    for (var i = 0; i < length; ++i) {
      var obj = removed[i];
      this.durabilityBreakItem(obj);
    }
};
 
Game_Actor.prototype.damageRandomDurability = function(value, group) {
    if (Mal.Param.DestroyEquip == 3) return;
    if (value === 0) return;
	if (this.equipDuraProtect()) return;
    var length = group.length;
    var valid = [];
    for (var i = 0; i < length; ++i) {
      var obj = group[i];
      if (!obj) continue;
      if (!obj.baseItemId) continue;
      if (obj.durability < 1) continue;
      if (obj.meta.NoBattleDD) continue;
      valid.push(obj)
    }
    var item = valid[Math.floor(Math.random() * valid.length)];
    if (!item) return;
    item.durability += value * this.DuraElementMul(obj.note);
	if (item.durability > item.durMax) item.durability = item.durMax;
    if (item.durability < 1) {
    item.durability = 0;
    this.durabilityBreakItem(item);
    }
};
 
Game_Actor.prototype.damageSpItemDurability = function(value, equip) {
    if (Mal.Param.DestroyEquip == 3) return;
    if (value == 0) return;
	if (this.equipDuraProtect()) return;
      var obj = equip;
      if (!obj) return;
      if (!obj.baseItemId) return;
      if (obj.durability < 1) return;
      if (obj.meta.NoBattleDD) return;
    obj.durability += value; // * this.DuraElementMul(obj.note);
	if (obj.durability > obj.durMax) obj.durability = obj.durMax;
    if (obj.durability < 1) {
    obj.durability = 0;
    this.durabilityBreakItem(obj);
    }
};
 
Game_Actor.prototype.durabilityBreakItem = function(obj) {
    if (!obj) return;
    if (Mal.Param.DestroyEquip == 0) this.discardEquip(obj);
    var slotId = this.equips().indexOf(obj);
    if (Mal.Param.DestroyEquip == 2) {
        this.releaseUnequippableItems();
    }
    this.playDurabilityBreakSound(obj);
    this.customDurabilityBreakEval(obj);
    this.durabilityBreakScrapItem(obj);
    var scene = SceneManager._scene;
    var win = scene._logWindow;
    if (!win) return;
    var fmt = Yanfly.Param.IDurBrokenText;
    var text = fmt.format(this.name(), obj.name, '\\i[' + obj.iconIndex + ']');
    if (Imported.YEP_BattleEngineCore) text = '<CENTER>' + text;
    win._lines.push(text);
    win.refresh();
    if (!Imported.YEP_BattleEngineCore) return;
    if (this._waitEnabled) return;
    this._waitEnabled = true;
    var frames = Yanfly.Param.IDurBrokenWait;
    if (frames > 0) BattleManager._actionList.push(['WAIT', [frames]]);
};
 
var MalparamPlus2 = Game_Actor.prototype.paramPlus
Game_Actor.prototype.paramPlus = function(paramId) {
    var value = MalparamPlus2.call(this, paramId);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            var perc = item.durability / item.durMax;
            if (Mal.DREdge || item.meta.dReverseEdge) perc = (2 - perc);
			if (item.durability == 0) perc = 0;
			value -= item.params[paramId];
            if (Mal.DAdjust >= perc && item.durability > -1) {
            value += item.params[paramId] * perc;
            } else {
            value += item.params[paramId];
            }
                }
        }
    return value;
};
 
Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
    for (;;) {
        var slots = this.equipSlots();
        var equips = this.equips();
        var changed = false;
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
                if (!forcing) {
                    this.tradeItemWithParty(null, item);
                    if (i == 0 && this.equips()[1]) {
                        var offhanditem = this.equips()[1];
                        this.tradeItemWithParty(null, this.equips()[1]);
                        if (offhanditem.wtypeId != 5) this._equips[i].setObject(offhanditem);
                    }
                }
                this._equips[i].setObject(null);
                changed = true;
            }
        }
        if (!changed) {
            break;
        }
    }
};
 
var MalApplyDurabilityEffects = Game_Action.prototype.applyDurabilityEffects
Game_Action.prototype.applyDurabilityEffects = function(target) {
    MalApplyDurabilityEffects.call(this, target);
    if (this.item().userEquipDurChange != []) {
        if (this.subject().isActor()) {
            this.applySpecEquipDurChange(this.subject().equips(), this.item().userEquipDurChange);
        }
    }
};
 
Game_Action.prototype.applySpecEquipDurChange = function(equips, durData) {
    for (var i = 0; i < equips.length; i++) {
        if (equips[i]) {
            for (var j = 0; j < durData.length; j++) {
                if (DataManager.isWeapon(equips[i]) && durData[j][0] == 1) {
                    if (equips[i].wtypeId == durData[j][1]) {
                        this.subject().damageSpItemDurability(durData[j][2], equips[i]);
                    }
                }
                if (DataManager.isArmor(equips[i]) && durData[j][0] == 2) {
                    if (equips[i].atypeId == durData[j][1]) {
                        this.subject().damageSpItemDurability(durData[j][2], equips[i]);
                    }
                }
            }
        }
    }
};
 
Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId) && !this.isEquipBroken(item);
};
 
Game_BattlerBase.prototype.canEquipArmor = function(item) {
    return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId) && !this.isEquipBroken(item);
};
 
Game_BattlerBase.prototype.isEquipBroken = function(item) {
    if (Mal.Param.DestroyEquip != 2) return false;
    return item.durability == 0;
};
 
Game_Party.prototype.durabilityBreakScrapItem = function(obj) {
if (obj.durScrapData == []) return;
for (var i = 0; i < obj.durScrapData.length; ++i) {
    var code = obj.durScrapData[i][0];
    if (Math.randomInt(100) < obj.durScrapData[i][3]){
        if (code == 1) var item = $dataItems[obj.durScrapData[i][1]];
        if (code == 2) var item = $dataWeapons[obj.durScrapData[i][1]];
        if (code == 3) var item = $dataArmors[obj.durScrapData[i][1]];
        $gameParty.gainItem(item, obj.durScrapData[i][2]);
        var amount = obj.durScrapData[i][2];
        if (amount == 1) {
            var text = '\\i[' + item.iconIndex + ']' + item.name + " salvaged!";
        } else {
            var text = '\\i[' + item.iconIndex + ']' + item.name + " x " + amount + " salvaged!";
        }
        $gameMessage.add(text);
    }
}
};
 
Game_Party.prototype.totalDurability = function(type) {
    var dur = 0;
    var durmax = 0;
   
    for (var i = 0; i < this.weapons().length; i++) {
        if (this.weapons()[i].durability == -1) continue;
        dur += this.weapons()[i].durability;
        durmax += this.weapons()[i].durMax;
    }
   
    for (var i = 0; i < this.armors().length; i++) {
        if (this.armors()[i].durability == -1) continue;
        dur += this.armors()[i].durability;
        durmax += this.armors()[i].durMax;
    }
   
    for (var i = 0; i < this.members().length; i++) {
    var mem = this.members()[i].equips();
        for (var j = 0; j < mem.length; j++) {
            if (!mem[j]) continue;
            if (mem[j].durability == -1) continue;
            dur += mem[j].durability;
            durmax += mem[j].durMax;
        }
    }
    if (type) return durmax;
    return dur;
}
 
Game_Party.prototype.fixAllDurability = function(perc) {
    var percent = 100;
    if (typeof perc !== "undefined" ) percent = Number(perc);
    for (var i = 0; i < this.weapons().length; i++) {
        if (this.weapons()[i].durability == -1) continue;
        if (this.weapons()[i].durability <= 0 && percent < 0) continue;
        this.weapons()[i].durability += this.weapons()[i].durMax * (percent / 100);
        this.weapons()[i].durability = this.weapons()[i].durability.clamp(0, this.weapons()[i].durMax);
        if (this.weapons()[i].durability < 1) {
        this.weapons()[i].durability = 0;
        this.durabilityBreakItem(this.weapons()[i]);
        }
    }
   
    for (var i = 0; i < this.armors().length; i++) {
        if (this.armors()[i].durability == -1) continue;
        if (this.armors()[i].durability <= 0 && percent < 0) continue;
        this.armors()[i].durability += this.armors()[i].durMax * (percent / 100.0);
        this.armors()[i].durability = this.armors()[i].durability.clamp(0, this.armors()[i].durMax);
        if (this.armors()[i].durability < 1) {
        this.armors()[i].durability = 0;
        this.durabilityBreakItem(this.armors()[i]);
        }
    }
 
    for (var i = 0; i < this.members().length; i++) {
    var mem = this.members()[i].equips();
        for (var j = 0; j < mem.length; j++) {
            if (!mem[j]) continue;
            if (mem[j].durability == -1) continue;
            if (mem[j].durability <= 0 && percent < 0) continue;
            mem[j].durability += mem[j].durMax * (percent / 100.0);
            mem[j].durability = mem[j].durability.clamp(0, mem[j].durMax);
        if (mem[j].durability < 1) {
        mem[j].durability = 0;
        this.durabilityBreakItem(mem[j]);
        }
        }
    }
};
 
Game_Party.prototype.changeItemDurability = function(type, id, amount) {
   
    if (type == "weapon"){
    for (var i = 0; i < this.weapons().length; i++) {
        if (this.weapons()[i].id != id || this.weapons()[i].durability == -1) continue;
        this.weapons()[i].durability += amount;
	  if (this.weapons()[i].durability > this.weapons()[i].durMax) this.weapons()[i].durability = this.weapons()[i].durMax;
        if (this.weapons()[i].durability < 1) {
        this.weapons()[i].durability = 0;
        this.durabilityBreakItem(this.weapons()[i]);
        }
        return;
    }
    }
   
    if (type == "armor"){
    for (var i = 0; i < this.armors().length; i++) {
        if (this.armors()[i].id != id || this.armors()[i].durability == -1) continue;
        this.armors()[i].durability += amount;
		if (this.armors()[i].durability > this.armors()[i].durMax) this.armors()[i].durability = this.armors()[i].durMax;
        if (this.armors()[i].durability < 1) {
        this.armors()[i].durability = 0;
        this.durabilityBreakItem(this.armors()[i]);
        }
        return;
    }
    }
   
    for (var i = 0; i < this.members().length; i++) {
    var mem = this.members()[i].equips();
        for (var j = 0; j < mem.length; j++) {
            if (!mem[j]) continue;
            if (mem[j].durability == -1) continue;
            if (type == "weapon" && mem[j].wtypeId && mem[j].id == id) {
            mem[j].durability += amount;
			if (mem[j].durability > mem[j].durMax) mem[j].durability = mem[j].durMax;
            if (mem[j].durability < 1) {
            mem[j].durability == 0;
            this.durabilityBreakItem(mem[j], i, j);
            return;
            }
            }
            if (type == "armor" && mem[j].atypeId && mem[j].id == id) {
            mem[j].durability += amount;
			if (mem[j].durability > mem[j].durMax) mem[j].durability = mem[j].durMax;
            if (mem[j].durability < 1) {
            mem[j].durability == 0;
            this.durabilityBreakItem(mem[j], i, j);
            return;
            }
            }
        }
    }
}
 
Game_Party.prototype.durabilityBreakItem = function(obj, memberId, equipSlot) {
    if (!obj) return;
    if (Mal.Param.DestroyEquip == 0) this.members()[memberId].discardEquip(obj);
    if (Mal.Param.DestroyEquip == 2) {
        obj.durability = 0;
        this.members()[memberId].releaseUnequippableItems();
    }
    this.durabilityBreakScrapItem(obj);
    this.playDurabilityBreakSound(obj);
};
 
Game_Party.prototype.playDurabilityBreakSound = function(obj) {
    var sound = obj.breakSound;
    if (!sound) {
      sound = {
        name:   Yanfly.Param.IDurBreakName,
        volume: Yanfly.Param.IDurBreakVol,
        pitch:  Yanfly.Param.IDurBreakPitch,
        pan:    Yanfly.Param.IDurBreakPan
      }
    }
    AudioManager.playSe(sound);
};
 
Window_ItemInfo.prototype.drawItemDurability = function(dy) {
    this.resetFontSettings();
    this.changeTextColor(this.systemColor());
    var text = Yanfly.Param.IDurText;
    var dx = this.textPadding();
    var dw = this.contents.width - this.textPadding() * 2;
    this.drawText(text, dx, dy, dw);
    var fmt = Yanfly.Param.IDurFmt;
    var cur = DataManager.getDurability(this._item);
    var max = DataManager.getMaxDurability(this._item);
    if (cur > -1) {
      this.changeTextColor(this.textColor(this.durabilityColor(cur, max)));
      text = fmt.format(cur, max)
    } else {
      this.changeTextColor(this.textColor(Yanfly.Param.IDurColor['unbreak']));
      text = Yanfly.Param.IDurUnbreakable;
    }
    this.drawText(text, dx, dy, dw, 'right');
    this.resetFontSettings();
    dy += this.lineHeight();
    return dy;

    };