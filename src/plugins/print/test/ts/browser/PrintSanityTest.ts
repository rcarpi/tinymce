import { Pipeline, Log } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { TinyLoader, TinyUi } from '@ephox/mcagar';

import PrintPlugin from 'tinymce/plugins/print/Plugin';
import Theme from 'tinymce/themes/silver/Theme';

UnitTest.asynctest('browser.tinymce.plugins.print.PrintSanityTest', (success, failure) => {

  Theme();
  PrintPlugin();

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    const tinyUi = TinyUi(editor);

    Pipeline.async({}, [ Log.step('TBA', 'Print: Assert print button exists',
      tinyUi.sWaitForUi('check print button exists', 'button[aria-label="Print"]')
    )], onSuccess, onFailure);
  }, {
    plugins: 'print',
    toolbar: 'print',
    skin_url: '/project/js/tinymce/skins/ui/oxide'
  }, success, failure);
});
