/**
 * ### При установке параметров сеанса
 * Процедура устанавливает параметры работы программы по умолчанию из package.json
 *
 * @param prm {Object} - в свойствах этого объекта определяем параметры работы программы
 */
module.exports = function get_settings(zone, config){

	return function settings(prm) {

		Object.assign(prm, {

			// разделитель для localStorage
			local_storage_prefix: "zd_",

			// авторизация couchdb
			user_node: {
				username: config.dbServer.user,
				password: config.dbServer.password
			},

			// расположение couchdb
			couch_path: "http://cou206:5984/wb_",

			pouch_filter: {
				doc: "auth/by_partner",
				meta: "auth/meta"
			},

			// по умолчанию, обращаемся к зоне 0
			zone: zone

		})
	}
}
