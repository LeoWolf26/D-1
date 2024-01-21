//==========================================================
 /*:
 * @plugindesc Disable equip optimize 
 * @author ---------------
 */
//==========================================================




Window_EquipCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.equip2,   'equip');
    this.addCommand(TextManager.clear,    'clear');
};