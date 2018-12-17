import { ApproxStructure, Assertions, Chain, Log, Mouse, NamedChain, Pipeline, UiFinder } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { Editor } from '@ephox/mcagar';
import { Element } from '@ephox/sugar';
import Wordcount from '../../../../../../plugins/wordcount/main/ts/Plugin';
import Theme from '../../../../main/ts/Theme';

UnitTest.asynctest('Statusbar Structure Test', (success, failure) => {

  Theme();
  Wordcount();

  const fullStatusbarSpec = (s, str, arr) => {
    return [
      s.element('div', {
        classes: [ arr.has('tox-statusbar__text-container')],
        children: [
          s.element('div', {
            classes: [ arr.has('tox-statusbar__path')],
            children: [
              s.element('div', { children: [ s.text(str.is('p')) ] }),
              s.element('div', { children: [ s.text(str.is(' » ')) ] }),
              s.element('div', { children: [ s.text(str.is('strong')) ] })
            ]
          }),
          s.element('span', {
            classes: [ arr.has('tox-statusbar__wordcount')],
            children: [ s.text(str.is('2 words')) ]
          }),
          s.element('span', {
            classes: [ arr.has('tox-statusbar__branding')],
            children: [
              s.text(str.is('Powered by ')),
              s.element('a', { children: [ s.text(str.is('Tiny')) ] })
            ]
          }),
        ]
      }),
      s.element('div', {
        classes: [ arr.has('tox-statusbar__resize-handle')],
      })
    ];
  };

  const statusbarWithoutWordcountSpec = (s, str, arr) => {
    return [
      s.element('div', {
        classes: [ arr.has('tox-statusbar__text-container')],
        children: [
          s.element('div', {
            classes: [ arr.has('tox-statusbar__path')],
            children: [
              s.element('div', { children: [ s.text(str.is('p')) ] }),
              s.element('div', { children: [ s.text(str.is(' » ')) ] }),
              s.element('div', { children: [ s.text(str.is('strong')) ] })
            ]
          }),
          s.element('span', {
            classes: [ arr.has('tox-statusbar__branding')],
            children: [
              s.text(str.is('Powered by ')),
              s.element('a', { children: [ s.text(str.is('Tiny')) ] })
            ]
          }),
        ]
      }),
      s.element('div', {
        classes: [ arr.has('tox-statusbar__resize-handle')],
      })
    ];
  };

  const statusbarWithoutResizeSpec = (s, str, arr) => {
    return [
      s.element('div', {
        classes: [ arr.has('tox-statusbar__text-container')],
        children: [
          s.element('div', {
            classes: [ arr.has('tox-statusbar__path')],
            children: [
              s.element('div', { children: [ s.text(str.is('p')) ] }),
              s.element('div', { children: [ s.text(str.is(' » ')) ] }),
              s.element('div', { children: [ s.text(str.is('strong')) ] })
            ]
          }),
          s.element('span', {
            classes: [ arr.has('tox-statusbar__branding')],
            children: [
              s.text(str.is('Powered by ')),
              s.element('a', { children: [ s.text(str.is('Tiny')) ] })
            ]
          })
        ]
      })
    ];
  };

  const cGetContainer = Chain.mapper((editor: any) => Element.fromDom(editor.editorContainer));

  const cSetContent = (content: string) => Chain.mapper(function (editor: any) {
    return editor.editorCommands.execCommand('mceSetContent', false, content);
  });

  const makeStep = (config, structureLabel, editorStructure) => {
    return Chain.asStep({}, [
      Editor.cFromSettings(config),
      NamedChain.asChain([
        NamedChain.direct(NamedChain.inputName(), Chain.identity, 'editor'),
        NamedChain.direct('editor', cSetContent('<p><strong>hello world</strong></p>'), ''),
        NamedChain.direct('editor', Chain.wait(300), ''),
        NamedChain.direct('editor', cGetContainer, 'editorContainer'),
        NamedChain.direct('editorContainer', Assertions.cAssertStructure(
          structureLabel,
          editorStructure
        ), 'assertion'),
        NamedChain.output('editor'),
      ]),
      Editor.cRemove
    ]);
  };

  Pipeline.async({}, [
    Log.step('TBA', 'Full statusbar', makeStep(
      {
        theme: 'silver',
        skin_url: '/project/js/tinymce/skins/ui/oxide',
        plugins: 'wordcount'
      },
      'Full statusbar structure',
      ApproxStructure.build((s, str, arr) => {
        return s.element('div', {
          classes: [ arr.has('tox-tinymce') ],
          children: [
            s.anything(),
            s.element('div', {
              classes: [ arr.has('tox-statusbar')],
              children: fullStatusbarSpec(s, str, arr)
            })
          ]
        });
      })
    )),

    Log.step('TBA', 'Statusbar without wordcount', makeStep(
      {
        theme: 'silver',
        skin_url: '/project/js/tinymce/skins/ui/oxide',
      },
      'Statusbar structure without wordcount',
      ApproxStructure.build((s, str, arr) => {
        return s.element('div', {
          classes: [ arr.has('tox-tinymce') ],
          children: [
            s.anything(),
            s.element('div', {
              classes: [ arr.has('tox-statusbar')],
              children: statusbarWithoutWordcountSpec(s, str, arr)
            })
          ]
        });
      })
    )),

    Log.step('TBA', 'Statusbar without resize', makeStep(
      {
        theme: 'silver',
        skin_url: '/project/js/tinymce/skins/ui/oxide',
        resize: false
      },
      'Statusbar structure without resize',
      ApproxStructure.build((s, str, arr) => {
        return s.element('div', {
          classes: [ arr.has('tox-tinymce') ],
          children: [
            s.anything(),
            s.element('div', {
              classes: [ arr.has('tox-statusbar')],
              children: statusbarWithoutResizeSpec(s, str, arr)
            })
          ]
        });
      })
    )),

    Log.step('TBA', 'Remove statusbar', makeStep(
      {
        theme: 'silver',
        skin_url: '/project/js/tinymce/skins/ui/oxide',
        statusbar: false
      },
      'Editor without statusbar',
      ApproxStructure.build((s, str, arr) => {
        return s.element('div', {
          classes: [ arr.has('tox-tinymce') ],
          children: [
            s.anything(),
          ]
        });
      })
    )),

    Log.step('TBA', 'Full statusbar - check element path on content change', Chain.asStep({}, [
      Editor.cFromSettings({
        theme: 'silver',
        skin_url: '/project/js/tinymce/skins/ui/oxide',
        toolbar: 'bold',
        resize: false,
        branding: false
      }),
      NamedChain.asChain([
        NamedChain.direct(NamedChain.inputName(), Chain.identity, 'editor'),
        NamedChain.direct('editor', cSetContent('<p><strong>hello</strong></p>'), 'content'),
        NamedChain.direct('editor', Chain.wait(300), 'wait1'),
        NamedChain.direct('editor', cGetContainer, 'editorContainer'),
        NamedChain.direct('editorContainer', Assertions.cAssertStructure(
          'Check p>strong element path',
          ApproxStructure.build((s, str, arr) => {
            return s.element('div', {
              classes: [ arr.has('tox-tinymce') ],
              children: [
                s.anything(),
                s.element('div', {
                  classes: [ arr.has('tox-statusbar')],
                  children: [
                    s.element('div', {
                      classes: [ arr.has('tox-statusbar__text-container')],
                      children: [
                        s.element('div', {
                          classes: [ arr.has('tox-statusbar__path')],
                          children: [
                            s.element('div', { children: [ s.text(str.is('p')) ] }),
                            s.element('div', { children: [ s.text(str.is(' » ')) ] }),
                            s.element('div', { children: [ s.text(str.is('strong')) ] })
                          ]
                        }),
                      ]
                    })
                  ]
                })
              ]
            });
          })
        ), 'assertion1'),
        NamedChain.direct('editorContainer', UiFinder.cFindIn('button[aria-label="Bold"]'), 'button'),
        NamedChain.direct('button', Mouse.cTrueClick, 'click'),
        NamedChain.direct('editor', Chain.wait(300), 'wait2'),
        NamedChain.direct('editorContainer', Assertions.cAssertStructure(
          'Check p element path',
          ApproxStructure.build((s, str, arr) => {
            return s.element('div', {
              classes: [ arr.has('tox-tinymce') ],
              children: [
                s.anything(),
                s.element('div', {
                  classes: [ arr.has('tox-statusbar')],
                  children: [
                    s.element('div', {
                      classes: [ arr.has('tox-statusbar__text-container')],
                      children: [
                        s.element('div', {
                          classes: [ arr.has('tox-statusbar__path')],
                          children: [
                            s.element('div', { children: [ s.text(str.is('p')) ] }),
                          ]
                        }),
                      ]
                    })
                  ]
                })
              ]
            });
          })
        ), 'assertion2'),
        NamedChain.output('editor')
      ]),
      Editor.cRemove
    ]))
  ], success, failure);
});