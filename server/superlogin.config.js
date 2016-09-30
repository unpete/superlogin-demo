console.log(__dirname);
// https://github.com/colinskow/superlogin/blob/master/config.example.js
module.exports = {
	testMode: {
		noEmail: !process.env.SENDGRID_USERNAME,
		debugEmail: !process.env.SENDGRID_USERNAME
	},
	security: {
		maxFailedLogins: 3
	},
	local: {
		sendConfirmEmail: true,
		requireEmailConfirm: false,
		loginOnRegistration: true,
		confirmEmailRedirectURL: '/confirm-email'
	},
	dbServer: {
		protocol: process.env.DB_HOST ? 'https://' : 'http://',
		host: process.env.DB_HOST || 'cou206:5984',
		user: 'admin',
		password: '13 _Morte',
		// automatically detect if the host is Cloudant
		cloudant: process.env.DB_HOST && process.env.DB_HOST.search(/\.cloudant\.com$/) > -1,
		userDB: 'sl_users',
		couchAuthDB: '_users'
	},
	session: {
		adapter: 'memory',
		redis: {
			url: process.env.REDIS_URL
		}
	},
	mailer: {
		fromEmail: process.env.FROM_EMAIL || 'noreply@example.com',
		transport: require('nodemailer-sendgrid-transport'),
		options: {
			auth: {
				api_user: process.env.SENDGRID_USERNAME,
				api_key: process.env.SENDGRID_PASSWORD
			}
		}
	},
	userDBs: {
		model: {
			todos: {
				designDocs: [],
				permissions: ['_reader', '_writer', '_replicator']
			}
		},
		defaultDBs: {
			private: ['todos'],
			shared: ['hw_meta', 'hw_0_ram', 'hw_0_doc']
		},
		privatePrefix: 'hw_',
		designDocDir: __dirname + '/designDocs'
	},
	providers: {
		facebook: {
			credentials: {
				clientID: process.env.FACEBOOK_CLIENTID,
				clientSecret: process.env.FACEBOOK_CLIENTSECRET,
				profileURL: 'https://graph.facebook.com/v2.4/me',
				profileFields: ['id', 'name', 'displayName', 'emails', 'age_range', 'link', 'gender', 'locale', 'timezone', 'updated_time', 'verified', 'picture', 'cover']
			},
			options: {
				scope: ['email', 'public_profile'],
				display: 'popup'
			}
		},
		yandex: {
			credentials: {
				clientID: '1ac1864c26f5420593023dba61b63415',
				clientSecret: 'afa56d65d1b6410a95bd732fd7d76d5c',
				callbackURL: "http://localhost:3000/auth/yandex/callback",
				callbackURL: 'https://light.oknosoft.ru/auth/yandex/callback'
			}
		},
		google: {
			credentials: {
				clientID: '53299452848-7qjqf2oisndq51g123821fkmn0pvel2f.apps.googleusercontent.com',
				clientSecret: 'YoXhOMs_Oz6SbM1cCPlBKmPx'
			},
			options: {
				scope: ['profile', 'email']
			}
		},
		github: {
			credentials: {
				clientID: '2cfeecd872961ca8b60c',
				clientSecret: '297947cf5469f6a5ea10ac53f503f8b5cd917915',
				scope: ['user:email']
			}
		},
		// windowslive: {
		//   credentials: {
		//     clientID: process.env.WINDOWSLIVE_CLIENTID,
		//     clientSecret: process.env.WINDOWSLIVE_CLIENTSECRET
		//   },
		//   options: {
		//     scope: ['wl.signin', 'wl.basic', 'wl.emails']
		//   }
		// },
		// linkedin: {
		//   credentials: {
		//     clientID: process.env.LINKEDIN_CLIENTID,
		//     clientSecret: process.env.LINKEDIN_CLIENTSECRET
		//   }
		// }
	}
};
