var ErrorCodes = require("orm").ErrorCodes;

module.exports = Plugin;

function Plugin(db) {
	return {
		define: function (Model) {
			Model.getRandom = function () {
				var args = Array.prototype.slice.apply(arguments);
				args.push(1);

				return Model.findRandom.apply(Model, args);
			};

			Model.findRandom = function () {
				var conditions = {};
				var limit      = 1;
				var cb         = null;

				for (var i = 0; i < arguments.length; i++) {
					switch (typeof arguments[i]) {
						case "function":
							cb = arguments[i];
							break;
						case "number":
							limit = arguments[i];
							break;
						case "object":
							conditions = arguments[i];
							break;
					}
				}

				if (typeof cb != "function") {
					throw ErrorCodes.generateError(ErrorCodes.MISSING_CALLBACK,
					                               "Missing Model.*Random() callback",
					                               { model: Model.table });
				}

				Model.count(conditions, function (err, total) {
					if (err) {
						return cb(err);
					}

					if (total === 0) {
						// nothing random..
						return cb(null, null);
					}

					var instances = [];
					var find_next = function () {
						if (instances.length == limit) {
							return cb(null, instances);
						}

						Model.find(conditions)
						     .offset(Math.round(Math.random() * (total - 1)))
						     .limit(1)
						     .first(
						function (err, instance) {
							if (err) {
								return cb(err);
							}

							instances.push(instance);

							return find_next();
						});
					};

					return find_next();
				});
			};
		}
	};
}
