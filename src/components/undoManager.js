//source: https://gist.github.com/kimhogeling/b646b432ba974f31c6e4

function Command(normalAction, undoAction, actionValue) {
    this.execute = normalAction;
    this.undo = undoAction;
    this.value = actionValue;
}

/**
 * Class for creating brave mountain climbers.
 * @constructor
 * @param {number} start The starting height.
 * @returns {Mountaineer}
 */
function Mountaineer(start) {
    // The achieved height.
    this._currentProgress = start || 0;
    // Contains instances of inherited Commands.
    this._commandsList = [];
    // We do not push and pop commands,
    // instead we keep them all and remember the current.
    // It start with -1, because this._commands is zero based.
    this._currentCommand = -1;
}

// Add the methods for mountaineers
Mountaineer.prototype = {
    constructor: Mountaineer,
    /**
     * Execute a new command.
     * @param {type} command Instance of a command.
     * @returns {undefined}
     */
    execute: function (command) {
        this._currentProgress = command.execute(this._currentProgress);
        this._currentCommand++;
        this._commandsList[this._currentCommand] = command;
        if (this._commandsList[this._currentCommand + 1]) {
            this._commandsList.splice(this._currentCommand + 1);
        }
    },
    /**
     * Undo the current command.
     * @returns {undefined}
     */
    undo: function () {
        var cmd = this._commandsList[this._currentCommand];
        if (!cmd) {
            console.error('Nothing to undo');
            return;
        }
        this._currentProgress = cmd.undo(this._currentProgress);
        this._currentCommand--;
    },
    /**
     * Redo the undone command.
     * @returns {undefined}
     */
    redo: function () {
        var cmd = this._commandsList[this._currentCommand + 1];
        if (!cmd) {
            console.error('Nothing to redo');
            return;
        }
        this._currentProgress = cmd.execute(this._currentProgress);
        this._currentCommand++;
    },
    /**
     * Simple getter of the current progress i.e. the achieved height.
     * @returns {Number}
     */
    getCurrentProgress: function () {
        return this._currentProgress;
    }
};

/**
 * Climb up action. One of the actions which will be used in the commands.
 * @param {type} actionValue Amount of climbed progress.
 * @returns {climb.value}
 */
function climbUp(actionValue) {
    // `this` is the instance of a command.
    return actionValue + this.value;
}

/**
 * Fall down action. One of the actions which will be used in the commands.
 * @param {type} actionValue Amount of falling regression.
 * @returns {fall.value}
 */
function fallDown(actionValue) {
    // `this` is the instance of a command.
    return actionValue - this.value;
}

/**
 * Command subtype for climbing up.
 * @constructor
 * @extends Command
 * @param {type} value The value, which will be passed to the action.
 * @returns {undefined}
 */
function CommandClimbUp(value) {
    // Constructor stealing for inheritance.
    // The order of climb and fall defines which is the normal vs undo action.
    Command.call(this, climbUp, fallDown, value);
}
// Prototype chaining for inheritance.
CommandClimbUp.prototype = Object.create(Command.prototype);

/**
 * Command subtype for falling down.
 * @constructor
 * @extends Command
 * @param {type} value The value, which will be passed to the action.
 * @returns {undefined}
 */
function CommandFallDown(value) {
    // Constructor stealing for inheritance.
    // The order of climb and fall defines which is the normal vs undo action.
    Command.call(this, fallDown, climbUp, value);
}
// Prototype chaining of inheritance.
CommandFallDown.prototype = Object.create(Command.prototype);