
// функция установки параметров сеанса
const settings = require('./settings.js')       // подключение к CouchDB

// функция инициализации структуры метаданных
const meta_init = require('./init.js')

const MetaEngine = require('metadata-core/index.js')
	.default.plugin(require('metadata-pouchdb/index.js').default)

const request = require('request')

const zd_config = {

	// зоны для генератора отчетов
	zones: [2]
}

module.exports = function (app, config) {

	const engines = [];

	zd_config.zones.forEach(function (zone) {

		// подключим метадату
		const $p = new MetaEngine();

		// инициализируем параметры сеанса и метаданные
		$p.wsql.init(settings(zone, config), meta_init);

		// читаем локальные данные в ОЗУ
		$p.adapters.pouch.load_data();

		setTimeout(function () {
			$p.adapters.pouch.log_in(config.dbServer.user, config.dbServer.password)
		}, 500)

		engines[zone] = $p;

	});

	/**
	 * Формируем отчеты /r/{zone}/{type}/{uid}?{query}
	 * @param zone - область данных
	 * @param type - тип отчета
	 * @param uid - идентификатор объекта, зависит от `type`
	 * @param query - дополнительные необязательные параметры
	 *
	 * http://localhost:3000/r/2/0/ce572a9a-3827-412d-a151-6fd753dd33b0
	 * http://localhost:3000/r/2/x/60e3a5e8-940c-4491-ecd2-6cef7cadde23?att=svg
	 */
	app.get('/r/:zone/:type/:uid', function(req, res, next) {

		const $p = engines[req.params.zone];

		if(!$p)
			return next();

		switch (req.params.type){
			case '0':
				// получаем документ расчет объект
				return $p.doc.calc_order.get(req.params.uid)
					.then(function(calc_order) {
						res.status(200).json(calc_order);
					}, function(err) {
						return next(err);
					});

			case 'x':
				// проксируем характеристики и вложения характеристик
				const url = $p.adapters.pouch.remote.doc._db_name + '/cat.characteristics|' + req.params.uid;
				const att = req.query.att;
				request.get(att ? url+'/'+att : url, {
					auth: {
						'user': config.dbServer.user,
						'pass': config.dbServer.password
					}
				})
					.pipe(res);
				break;

			default:
				return next();
		}

	});
}
