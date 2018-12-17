import { Pipeline, Step, Keys, RawAssertions, Log } from '@ephox/agar';
import { TinyActions, TinyApis, TinyLoader } from '@ephox/mcagar';
import { UnitTest } from '@ephox/bedrock';
import VK from 'tinymce/core/api/util/VK';
import NonbreakingPlugin from 'tinymce/plugins/nonbreaking/Plugin';
import 'tinymce/themes/silver/Theme';

UnitTest.asynctest(
  'browser.tinymce.plugins.nonbreaking.NonbreakingForceTabTest', (success, failure) => {

    NonbreakingPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      const tinyApis = TinyApis(editor);
      const tinyActions = TinyActions(editor);

      Pipeline.async({}, [
        Log.stepsAsStep('TBA', 'NonBreaking: Undo level on insert tab', [
          tinyActions.sContentKeystroke(Keys.tab(), {}),
          tinyApis.sAssertContent('<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>'),
          Step.sync(function () {
            editor.undoManager.undo();
          }),
          tinyApis.sAssertContent('')
        ]),
        Log.step('TBA', 'NonBreaking: Prevent default and other handlers on insert tab',
          Step.sync(function () {
            const args = editor.fire('keydown', { keyCode: VK.TAB });
            RawAssertions.assertEq('Default should be prevented', true, args.isDefaultPrevented());
            RawAssertions.assertEq('Should not propagate', true, args.isImmediatePropagationStopped());
          })
        )
      ], onSuccess, onFailure);
    }, {
      plugins: 'nonbreaking',
      toolbar: 'nonbreaking',
      nonbreaking_force_tab: 5,
      theme: 'silver',
      skin_url: '/project/js/tinymce/skins/ui/oxide',
    }, success, failure);
  }
);