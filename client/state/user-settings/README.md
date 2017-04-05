User Settings
=============

This store holds user settings from `/me/settings`.

# Usage

1. Render `QueryUserSettings` from `components/data/query-user-settings`
2. Connect your component specifying proper setting names:
```es6
export default connect(
	( state ) => {
		return {
			language: getUserSetting( state, 'language' ),
		};
	},
	( dispatch ) => {
		return bindActionCreators( {
			saveLanguage: language => saveUserSettings( { language } ),
		}, dispatch );
	},
)( Account );
```
