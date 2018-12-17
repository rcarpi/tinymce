import 'tinymce/themes/silver/Theme';

import { Keyboard, Keys, Log, Pipeline, UiFinder } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { TinyApis, TinyLoader } from '@ephox/mcagar';
import { Body, Element } from '@ephox/sugar';
import EmoticonsPlugin from 'tinymce/plugins/emoticons/Plugin';

UnitTest.asynctest('browser.tinymce.plugins.emoticons.AutocompletionTest', (success, failure) => {

  EmoticonsPlugin();

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    const tinyApis = TinyApis(editor);
    const eDoc = Element.fromDom(editor.getDoc());

    // NOTE: This is almost identical to charmap
    Pipeline.async({},
      Log.steps('TBA', 'Emoticons: Autocomplete, trigger an autocomplete and check it appears', [
        tinyApis.sFocus,
        tinyApis.sSetContent('<p>:ha</p>'),
        tinyApis.sSetCursor([ 0, 0 ], 3),
        Keyboard.sKeypress(eDoc, 'a'.charCodeAt(0), { }),
        UiFinder.sWaitForVisible('Waiting for autocomplete menu', Body.body(), '.tox-autocompleter .tox-collection__item'),
        Keyboard.sKeydown(eDoc, Keys.right(), { }),
        Keyboard.sKeydown(eDoc, Keys.right(), { }),
        Keyboard.sKeydown(eDoc, Keys.enter(), { }),
        tinyApis.sAssertContent('<p>😂</p>')
      ])
    , onSuccess, onFailure);
  }, {
    plugins: 'emoticons',
    toolbar: 'emoticons',
    theme: 'silver',
    skin_url: '/project/js/tinymce/skins/ui/oxide',
    emoticons_database_url: '/project/src/plugins/emoticons/test/js/test-emojis.js'
  }, success, failure);
});
