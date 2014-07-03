/** js sequence diagrams
 *  http://bramp.github.io/js-sequence-diagrams/
 *  (c) 2012-2013 Andrew Brampton (bramp.net)
 *  Simplified BSD license.
 */
(function () {
	"use strict";
	/*global grammar _ */

	function Diagram() {
		this.title   = undefined;
		this.actors  = [];
		this.signals = [];
	}

	Diagram.prototype.getActor = function(alias) {
		var s = /^(.+) as (\S+)$/i.exec(alias.trim());
		if (s) {
			name  = s[1].trim();
			alias = s[2].trim();
		} else {
			name = alias.trim();
		}

		name = name.replace(/\\n/gm, "\n");

		var i, actors = this.actors;
		for (i in actors) {
			if (actors[i].alias == alias)
				return actors[i];
		}
		i = actors.push( new Diagram.Actor(alias, name, actors.length, false) );
		return actors[ i - 1 ];
	};

	Diagram.prototype.setTitle = function(title) {
		this.title = title;
	};

	Diagram.prototype.addSignal = function(signal) {
		this.signals.push( signal );
	};

	Diagram.Actor = function(alias, name, index, sec) {
		this.alias = alias;
		this.name  = name;
		this.index = index;
                this.secure = sec;
	};

	Diagram.Signal = function(actorA, signaltype, actorB, message, ev1, ev2) {
		this.type       = "Signal";
		this.actorA     = actorA;
		this.actorB     = actorB;
		this.linetype   = signaltype & 3;
		this.arrowtype  = (signaltype >> 2) & 3;
		this.message    = message;
                this.ev1        = ev1;
                this.ev2        = ev2;
                this.data       = [];
	};

	Diagram.Signal.prototype.isSelf = function() {
		return this.actorA.index == this.actorB.index;
	};

	Diagram.Note = function(actor, placement, message, ev1, ev2) {
		this.type      = "Note";
		this.actor     = actor;
		this.placement = placement;
		this.message   = message;
                this.ev1       = ev1;
                this.ev2       = ev2;

		if (this.hasManyActors() && actor[0] == actor[1]) {
			throw new Error("Note should be over two different actors");
		}
	};

	Diagram.Note.prototype.hasManyActors = function() {
		return _.isArray(this.actor);
	};

	Diagram.LINETYPE = {
		SOLID  : 0,
		DOTTED : 1
	};

	Diagram.ARROWTYPE = {
		FILLED  : 0,
		OPEN    : 1
	};

	Diagram.PLACEMENT = {
		LEFTOF  : 0,
		RIGHTOF : 1,
		OVER    : 2
	};

	// Expose this class externally
	this.Diagram = Diagram;

}).call(this);
