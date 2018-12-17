import { ApproxStructure, Assertions, Chain, GeneralSteps, Log, Pipeline, UiFinder, Waiter } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { TinyLoader, TinyUi } from '@ephox/mcagar';
import { Body, Element, Traverse } from '@ephox/sugar';
import Theme from 'tinymce/themes/silver/Theme';
import { UiSidebarApi } from '../../../../../../core/main/ts/api/Editor';
import { TestStore } from '../../module/AlloyTestUtils';

interface EventLog {
  name: string;
  index: number;
}

UnitTest.asynctest('tinymce.themes.silver.test.browser.sidebar.SidebarTest', function (success, failure) {
  const store = TestStore();
  Theme();

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    const tinyUi = TinyUi(editor);

    const sClickAndAssertEvents = function (tooltip, expected: EventLog[]) {
      return GeneralSteps.sequence([
        store.sClear,
        tinyUi.sClickOnToolbar('Toggle sidebar', 'button[aria-label="' + tooltip + '"]'),
        Waiter.sTryUntil('Checking sidebar callbacks', store.sAssertEq('Asserting sidebar callbacks', expected), 10, 1000),
      ]);
    };

    Pipeline.async(editor, Log.steps('TBA', 'Sidebar actions test', [
      Chain.asStep(Body.body(), [
        UiFinder.cFindIn('.tox-sidebar-wrap .tox-sidebar'),
        Assertions.cAssertStructure('Checking structure', ApproxStructure.build((s, str, arr) => {
          return s.element('div', {
            classes: [arr.has('tox-sidebar')],
            children: [
              s.element('div', {
                classes: [arr.has('tox-sidebar__slider')],
                children: [
                  s.element('div', {
                    classes: [arr.has('tox-sidebar__pane-container')],
                    children: [
                      s.element('div', {
                        classes: [arr.has('tox-sidebar__pane')],
                        styles: { display: str.is('none') },
                        attrs: { 'aria-hidden': str.is('true') }
                      }),
                      s.element('div', {
                        classes: [arr.has('tox-sidebar__pane')],
                        styles: { display: str.is('none') },
                        attrs: { 'aria-hidden': str.is('true') }
                      }),
                      s.element('div', {
                        classes: [arr.has('tox-sidebar__pane')],
                        styles: { display: str.is('none') },
                        attrs: { 'aria-hidden': str.is('true') }
                      })
                    ]
                  })
                ]
              })
            ]
          });
        }))
      ]),
      Waiter.sTryUntil('Checking initial events', store.sAssertEq('Asserting intial render and hide of sidebar', [
        {name: 'mysidebar1:render', index: 0},
        {name: 'mysidebar2:render', index: 1},
        {name: 'mysidebar3:render', index: 2},
        {name: 'mysidebar1:hide', index: 0},
        {name: 'mysidebar2:hide', index: 1},
        {name: 'mysidebar3:hide', index: 2},
      ]), 10, 1000),
      sClickAndAssertEvents('My sidebar 1', [{name: 'mysidebar1:show', index: 0}]),
      sClickAndAssertEvents('My sidebar 2', [{name: 'mysidebar1:hide', index: 0}, {name: 'mysidebar2:show', index: 1}]),
      sClickAndAssertEvents('My sidebar 3', [{name: 'mysidebar2:hide', index: 1}, {name: 'mysidebar3:show', index: 2}]),
      sClickAndAssertEvents('My sidebar 3', [{name: 'mysidebar3:hide', index: 2}]),
    ]), onSuccess, onFailure);
  }, {
    theme: 'silver',
    skin_url: '/project/js/tinymce/skins/ui/oxide',
    toolbar: 'mysidebar1 mysidebar2 mysidebar3',
    setup (editor) {
      const logEvent = (name: string) => (api: UiSidebarApi) => {
        const index = Traverse.findIndex(Element.fromDom(api.element())).getOr(-1);
        const entry: EventLog = {name, index};
        store.adder(entry)();
      };
      const handleRender = (eventName: string) => (api: UiSidebarApi) => {
        api.element().appendChild(Element.fromHtml('<div style="width: 200px; background: red;"></div>').dom());
        logEvent(eventName)(api);
      };
      editor.addSidebar('mysidebar1', {
        tooltip: 'My sidebar 1',
        icon: 'bold',
        onrender: handleRender('mysidebar1:render'),
        onshow: logEvent('mysidebar1:show'),
        onhide: logEvent('mysidebar1:hide')
      });

      editor.addSidebar('mysidebar2', {
        tooltip: 'My sidebar 2',
        icon: 'italic',
        onrender: handleRender('mysidebar2:render'),
        onshow: logEvent('mysidebar2:show'),
        onhide: logEvent('mysidebar2:hide')
      });

      editor.addSidebar('mysidebar3', {
        tooltip: 'My sidebar 3',
        icon: 'comment',
        onrender: handleRender('mysidebar3:render'),
        onshow: logEvent('mysidebar3:show'),
        onhide: logEvent('mysidebar3:hide')
      });
    },
  }, success, failure);
});
