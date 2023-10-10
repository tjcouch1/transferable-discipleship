/**
 * Copyright (C) 2023 TJ Couch
 * This file is part of discipleship‑app‑template.
 *
 * discipleship‑app‑template is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * discipleship‑app‑template is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with discipleship‑app‑template. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * ScreenService.ts - Handles getting the page structure
 */

import { ContentListData } from '../components/contents/ContentList';
import { ContentData } from '../components/contents/Contents';
import { ContentListScreenData } from '../components/screens/ContentListScreen';
import {
  SerializedAppData,
  ScreenData,
  AppData,
  ScreenMap,
} from '../components/screens/Screens';
import { ROOT_PATH, PATH_DELIMITER, pathJoin } from '../util/PathUtil';
import { APP_VERSION } from '../util/Util';

//const serializedAppDataNew: SerializedAppData = require('../../assets/data/screens.json');
const serializedAppDataNew: SerializedAppData = {
  version: '1.0.0',
  initialScreen: 'Home',
  screens: [
    {
      id: 'Home',
      title: 'TD Home',
      showNavigationBar: false,
      type: 'ContentListScreen',
      design: 'loose',
      contents: [
        {
          type: 'Header',
          headerText: 'Transferable Discipleship',
          subheaderText:
            'A tool for Simple, Accessible, and Transferable Christian discipleship',
          lineTexts: ['Please select an option below'],
          design: 'title',
        },
        {
          type: 'ActionButton',
          text: 'Basics',
          action: {
            type: 'navigate',
            to: 'Basics',
          },
        },
        {
          type: 'ActionButton',
          text: 'Essentials',
          action: {
            type: 'navigate',
            to: 'Essentials',
          },
        },
        {
          type: 'ActionButton',
          text: 'How to',
          action: {
            type: 'navigate',
            to: 'How to',
          },
        },
        {
          type: 'ActionButton',
          text: 'About',
          action: {
            type: 'navigate',
            to: 'About',
          },
        },
      ],
      subscreens: [
        {
          id: 'Basics',
          type: 'ContentListScreen',
          contents: [
            {
              type: 'Header',
              headerText: 'Basics',
            },
            {
              type: 'ActionButton',
              text: 'Gospel Review',
              action: {
                type: 'navigate',
                to: 'Gospel Review',
              },
            },
            {
              type: 'ActionButton',
              text: 'Scripture 1.0',
              action: {
                type: 'navigate',
                to: 'Scripture 1.0',
              },
            },
            {
              type: 'ActionButton',
              text: 'Assurance of Salvation',
              action: {
                type: 'navigate',
                to: 'Assurance of Salvation',
              },
            },
            {
              type: 'ActionButton',
              text: 'Holy Spirit',
              action: {
                type: 'navigate',
                to: 'Holy Spirit',
              },
            },
            {
              type: 'ActionButton',
              text: 'Prayer',
              action: {
                type: 'navigate',
                to: 'Prayer',
              },
            },
          ],
          subscreens: [
            {
              id: 'Gospel Review',
              type: 'ContentListScreen',
              design: 'loose',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Gospel Review',
                },
                {
                  type: 'ActionButton',
                  text: 'What is the relationship between God & man?',
                  action: {
                    type: 'navigate',
                    to: 'RelationshipGodMan',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: "What is God's plan to restore our relationship?",
                  },
                  action: {
                    type: 'navigate',
                    to: 'RestoreRelationship',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'What did Jesus do?',
                  action: {
                    type: 'navigate',
                    to: 'WhatJesusDo',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'How should I respond?',
                  action: {
                    type: 'navigate',
                    to: 'HowRespond',
                  },
                },
                {
                  type: 'ActionButton',
                  text: 'The whole story',
                  action: {
                    type: 'navigate',
                    to: 'WholeStory',
                  },
                },
              ],
              subscreens: [
                {
                  id: 'RelationshipGodMan',
                  title: 'Gospel Review',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What is the relationship between God & man?',
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText: 'What is true of God?',
                      scripture: {
                        reference: 'Acts 17:24-28',
                        revealedButton: {
                          text: 'Creator; desires to be known',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText: 'What is the nature of man?',
                      scripture: [
                        {
                          reference: 'Ephesians 2:1-3',
                          revealedButton: {
                            text: 'Dead',
                          },
                        },
                        {
                          reference: 'Romans 3:23',
                          revealedButton: {
                            text: 'All have sinned',
                          },
                        },
                        {
                          reference: 'Romans 6:23',
                          revealedButton: {
                            text: 'Deserve death',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'RestoreRelationship',
                  title: 'Gospel Review',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText:
                        "What is God's plan to restore our relationship?",
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText: 'What is the purpose of the law?',
                      scripture: {
                        reference: 'Romans 3:21-26',
                        revealedButton: {
                          text: 'Points us to Jesus',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText: 'How were people saved in the Old Testament?',
                      scripture: {
                        reference: 'Romans 4:2-8',
                        revealedButton: {
                          text: 'Faith in Christ',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText: 'How are people saved now?',
                      scripture: [
                        {
                          reference: 'Ephesians 2:4-5',
                        },
                        {
                          reference: 'Ephesians 2:8-9',
                          revealedButton: {
                            text: 'Faith, not works',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'WhatJesusDo',
                  title: 'Gospel Review',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What did Jesus do?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 5:6-8',
                        revealedButton: {
                          text: 'Died in our place',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 5:18-19',
                        revealedButton: {
                          text: 'Made us righteous',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 14:6',
                        revealedButton: {
                          text: 'Only way',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 Corinthians 15:3-8',
                        revealedButton: {
                          text: 'Proved His resurrection',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Corinthians 5:21',
                        revealedButton: {
                          text: 'Took our sin; gave us His righteousness',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'HowRespond',
                  title: 'Gospel Review',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'How should I respond?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 3:16-18',
                        revealedButton: {
                          text: 'Believe or condemned already',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 10:8-10',
                        revealedButton: {
                          text: 'Confess & believe',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Mark 1:15',
                        revealedButton: {
                          text: 'Repent & believe',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Acts 3:19',
                        revealedButton: {
                          text: 'Repent & turn to God',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Corinthians 5:15',
                        revealedButton: {
                          text: 'New reason to live',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'WholeStory',
                  title: 'Gospel Review',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'The whole story',
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText:
                        'God exists, and He created everything, including people who bear His image, to know Him personally.',
                      scripture: {
                        reference: 'Acts 17:24-28',
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText:
                        'As God, He is perfect and has a perfect standard that, as His image bearers, we have all failed to meet.',
                      scripture: {
                        reference: 'Romans 3:23',
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText:
                        'That imperfection, called sin, has caused us to be separated from the perfect God.',
                      scripture: {
                        reference: 'Romans 6:23',
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText:
                        'God knew this would happen from the beginning and set up a plan to show us our inability to make things right between us and Him.',
                      scripture: [
                        {
                          reference: 'Romans 3:21-26',
                        },
                        {
                          reference: 'Romans 4:2-6',
                        },
                        {
                          reference: 'Ephesians 2:8-9',
                        },
                      ],
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText:
                        'The plan was to send His only Son to live a perfect life and, dying on a cross, to exchange our sin for His right standing before God.',
                      scripture: [
                        {
                          reference: 'Romans 5:6-8, 18-19',
                        },
                        {
                          reference: 'John 14:6',
                        },
                        {
                          reference: '2 Corinthians 5:21',
                        },
                      ],
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText:
                        'All who repent and believe in Him receive eternal life.',
                      scripture: [
                        {
                          reference: 'John 3:16-18',
                        },
                        {
                          reference: 'Romans 10:8-10',
                        },
                      ],
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText:
                        'Life now has new meaning, no longer to live for self but for God.',
                      scripture: {
                        reference: '2 Corinthians 5:15',
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'Scripture 1.0',
              type: 'ContentListScreen',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Scripture 1.0',
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Intro to Scripture',
                  },
                  action: {
                    type: 'navigate',
                    to: 'IntroScripture',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Why is Scripture so great?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhyScriptureGreat',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What does Scripture do?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhatScriptureDo',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What should we do?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhatWeDo',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'How does this affect me?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'HowAffectMe',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What does my time with God look like?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'TimeWithGod',
                  },
                },
              ],
              subscreens: [
                {
                  id: 'IntroScripture',
                  title: 'Scripture 1.0',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Intro to Scripture',
                    },
                    {
                      type: 'Slide',
                      canClose: false,
                      contents: [
                        {
                          type: 'Text',
                          text: 'Scripture 1.0 is not intended to answer all the questions you have about the Bible. Scripture 2.0 (coming soon) will address more reliability issues. What Scripture 1.0 is intended to do is to give you a picture, by looking at a lot of Scripture, of the benefits of reading Scripture and how it affects our lives. It is intended to help you to see the importance of digging into the Bible daily.',
                          style: {
                            fontWeight: 'bold',
                          },
                        },
                        '‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒‒',
                        {
                          type: 'Text',
                          text: '"The Bible is the inevitable outcome of God\'s continuous speech. It is the infallible declaration of His mind for us to put into our familiar human words."',
                          style: {
                            fontStyle: 'italic',
                          },
                        },
                        {
                          type: 'Text',
                          text: '-A. W. Tozer (Pursuit of God)',
                          style: {
                            textAlign: 'right',
                            fontStyle: 'italic',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'WhyScriptureGreat',
                  title: 'Scripture 1.0',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Why is Scripture so great?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 15:4',
                        revealedButton: {
                          text: 'Instruction; endurance; encouragement; hope',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Psalm 19:7-11',
                        revealedButton: {
                          text: 'Perfect; right; pure; equalizing; sweet; great reward for obedience',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 17:17',
                        revealedButton: {
                          text: 'Truth',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'WhatScriptureDo',
                  title: 'Scripture 1.0',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What does Scripture do?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Timothy 3:14-17',
                        revealedButton: {
                          text: 'Wise unto salvation',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Psalm 119:105',
                        revealedButton: {
                          text: 'Light; lamp',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Matthew 4:4',
                        revealedButton: {
                          text: 'Gives life',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'WhatWeDo',
                  title: 'Scripture 1.0',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What should we do?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Psalm 1:1-3',
                        revealedButton: {
                          text: 'Delight; meditate continually',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Matthew 7:24-27',
                        revealedButton: {
                          text: 'Hear & do',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 8:31-32',
                        revealedButton: {
                          text: 'Abide',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'HowAffectMe',
                  title: 'Scripture 1.0',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'How does this affect me?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Psalm 119:11',
                        revealedButton: {
                          text: 'Stored up to not sin',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Psalm 40:8',
                        revealedButton: {
                          text: "Delight to do God's will",
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Deuteronomy 11:18-20',
                        revealedButton: {
                          text: 'Affects every aspect of our lives',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'TimeWithGod',
                  title: 'Scripture 1.0',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What does my time with God look like?',
                    },
                    {
                      type: 'Slide',
                      canClose: false,
                      contents: [
                        {
                          type: 'Text',
                          text: 'It is important to develop a consistent daily discipline of reading Scripture.',
                          style: {
                            fontWeight: 'bold',
                          },
                        },
                        'Here are some questions to set you on the right track. To develop a daily time with the Lord, ask yourself the following questions:',
                      ],
                    },
                    {
                      type: 'Slide',
                      headerText: 'When',
                      contents: [
                        'When will you make time for reading?',
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'Guard that time!',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'Slide',
                      headerText: 'Where',
                      contents: [
                        'Where are you going to do it each day?',
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'It may sound silly, but finding a distraction-free place is important',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'Slide',
                      headerText: 'What',
                      contents: [
                        'What reading plan will you use?',
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'I suggest one that will get you through all of the Bible, not just the parts you like to read',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'Slide',
                      headerText: 'How',
                      contents: [
                        'Are there resources you need to accomplish your goal?',
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'Who will keep you accountable?',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'Assurance of Salvation',
              type: 'ContentListScreen',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Assurance of Salvation',
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'How can I know that my faith is secure?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'KnowFaithSecure',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What does a saved person look like?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhatSavedLook',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'How can I know that I am saved?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'HowKnowSaved',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Can anything cause me to lose my salvation?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'CanLoseSalvation',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: "Was Jesus' sacrifice enough?",
                  },
                  action: {
                    type: 'navigate',
                    to: 'WasJesusEnough',
                  },
                },
              ],
              subscreens: [
                {
                  id: 'KnowFaithSecure',
                  title: 'Assurance of Salvation',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'How can I know that my faith is secure?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Corinthians 13:5',
                        revealedButton: {
                          text: 'Test yourself',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'WhatSavedLook',
                  title: 'Assurance of Salvation',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What does a saved person look like?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Corinthians 5:17',
                        revealedButton: {
                          text: 'New creation',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Ephesians 4:20-24',
                        revealedButton: {
                          text: 'Put off old/put on new',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'HowKnowSaved',
                  title: 'Assurance of Salvation',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'How can I know that I am saved?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 John 2:3-6',
                        revealedButton: {
                          text: 'Obedience',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 John 3:6, 9-10',
                        revealedButton: {
                          text: 'Choose to sin less',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 John 3:14',
                        revealedButton: {
                          text: 'Love others',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 John 3:24',
                        revealedButton: {
                          text: 'Spirit in us',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'CanLoseSalvation',
                  title: 'Assurance of Salvation',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Can anything cause me to lose my salvation?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 John 5:12-13',
                        revealedButton: {
                          text: 'You CAN know',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 10:27-29',
                        revealedButton: {
                          text: "Secure in God's hands",
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 17:11-12',
                        revealedButton: {
                          text: 'Jesus kept, protected, and prays for the Father to do the same',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Ephesians 1:13-14',
                        revealedButton: {
                          text: 'Sealed by the Holy Spirit',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 8:31-39',
                        revealedButton: {
                          text: 'Nothing can separate us',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'WasJesusEnough',
                  title: 'Assurance of Salvation',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: "Was Jesus' sacrifice enough?",
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Hebrews 10:11-18',
                        revealedButton: {
                          text: 'Once was enough!',
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'Holy Spirit',
              type: 'ContentListScreen',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Holy Spirit',
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Who is the Holy Spirit?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhoHolySpirit',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What does the Holy Spirit do?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhatHolySpiritDo',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What is the role of the Holy Spirit?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhatRoleHolySpirit',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Where does the Holy Spirit live?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhereHolySpiritLive',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'How should we respond?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'HowRespond',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: "What is God's invitation to us?",
                  },
                  action: {
                    type: 'navigate',
                    to: 'GodsInvitation',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Summary',
                  },
                  action: {
                    type: 'navigate',
                    to: 'Summary',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What is Spiritual Breathing?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'SpiritualBreathing',
                  },
                },
              ],
              subscreens: [
                {
                  id: 'WhoHolySpirit',
                  title: 'Holy Spirit',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Who is the Holy Spirit?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Genesis 1:1-2',
                        revealedButton: {
                          text: 'Present at creation',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Corinthians 3:17-18',
                        revealedButton: {
                          text: 'The Holy Spirit is God',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Matthew 3:16-17',
                        revealedButton: {
                          text: 'Trinity',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'WhatHolySpiritDo',
                  title: 'Holy Spirit',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What does the Holy Spirit do?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 5:5',
                        revealedButton: {
                          text: "Lets us know God's love",
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Ephesians 3:16',
                        revealedButton: {
                          text: 'Strengthens our weaknesses',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 14:25-26',
                        revealedButton: {
                          text: 'Teaches us',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 Corinthians 2:10-12',
                        revealedButton: {
                          text: 'Gives us understanding',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 16:13-14',
                        revealedButton: {
                          text: 'Guides us to Truth',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Acts 1:8',
                        revealedButton: {
                          text: 'Power to witness',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'WhatRoleHolySpirit',
                  title: 'Holy Spirit',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What is the role of the Holy Spirit?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Peter 1:20-21',
                        revealedButton: {
                          text: 'Source of Scriptures',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Ephesians 1:13-14',
                        revealedButton: {
                          text: 'Salvation seal',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Timothy 1:13-14',
                        revealedButton: {
                          text: 'Guards doctrine',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'WhereHolySpiritLive',
                  title: 'Holy Spirit',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Where does the Holy Spirit live?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Ezekiel 36:26-27',
                        revealedButton: {
                          text: 'In you',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 Corinthians 3:16',
                        revealedButton: {
                          text: 'In you',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'HowRespond',
                  title: 'Holy Spirit',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'How should we respond?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Acts 2:38',
                        revealedButton: {
                          text: 'Repent/receive the Spirit',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Galatians 5:16-25',
                        revealedButton: {
                          text: 'Walk by the Spirit/deeds vs fruit',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'GodsInvitation',
                  title: 'Holy Spirit',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: "What is God's invitation to us?",
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Ephesians 5:15-20',
                        revealedButton: {
                          text: 'Walk by the Spirit/deeds vs. fruit',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'Summary',
                  title: 'Holy Spirit',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Summary',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 8:1-2',
                        revealedButton: {
                          text: 'Freedom',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 8:3-4',
                        revealedButton: {
                          text: 'New desires',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 8:5-11',
                        revealedButton: {
                          text: 'Life',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 8:12-13',
                        revealedButton: {
                          text: 'Death to sin',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 8:14-16',
                        revealedButton: {
                          text: 'Family of God',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'SpiritualBreathing',
                  title: 'Holy Spirit',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What is Spiritual Breathing?',
                    },
                    {
                      type: 'Slide',
                      headerText:
                        'An exercise in walking in the power of the Holy Spirit.',
                      canClose: false,
                      contents: [],
                    },
                    {
                      type: 'Slide',
                      headerText: 'Exhale:',
                      canClose: false,
                      contentDesign: 'tight',
                      contents: [
                        {
                          type: 'Text',
                          text: 'Confession',
                          style: {
                            fontWeight: 'bold',
                          },
                        },
                        '1. Agree with God that I have wronged Him with my sin.',
                        '2. Agree with God about His provision for my sin.',
                        {
                          type: 'Text',
                          text: '1 John 1:9',
                          style: {
                            alignSelf: 'flex-start',
                            fontWeight: 'bold',
                            paddingLeft: 35,
                          },
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: '1 John 1:9',
                          style: {
                            alignSelf: 'flex-start',
                            fontStyle: 'italic',
                            paddingLeft: 35,
                          },
                        },
                        '3. Repent (change your mind, actions, and heart)',
                      ],
                    },
                    {
                      type: 'Slide',
                      headerText: 'Inhale:',
                      canClose: false,
                      contentDesign: 'tight',
                      contents: [
                        {
                          type: 'Text',
                          text: "Be filled with the Spirit to walk in light of God's forgiveness and empowerment.",
                          style: {
                            fontWeight: 'bold',
                          },
                        },
                        {
                          type: 'Text',
                          text: "1. God's command:",
                          style: {
                            alignSelf: 'flex-start',
                          },
                        },
                        {
                          type: 'Text',
                          text: 'Ephesians 5:18',
                          style: {
                            alignSelf: 'flex-start',
                            fontWeight: 'bold',
                            paddingLeft: 35,
                          },
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: 'Ephesians 5:18',
                          style: {
                            alignSelf: 'flex-start',
                            fontStyle: 'italic',
                            paddingLeft: 35,
                          },
                        },
                        {
                          type: 'Text',
                          text: '2. His promise:',
                          style: {
                            alignSelf: 'flex-start',
                          },
                        },
                        {
                          type: 'Text',
                          text: '1 John 5:14-15',
                          style: {
                            alignSelf: 'flex-start',
                            fontWeight: 'bold',
                            paddingLeft: 35,
                          },
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: '1 John 5:14-15',
                          style: {
                            alignSelf: 'flex-start',
                            fontStyle: 'italic',
                            paddingLeft: 35,
                          },
                        },
                        '3. Thank Him for His grace, forgiveness, and indwelling Spirit.',
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'Prayer',
              type: 'ContentListScreen',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Prayer',
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Introduction to prayer',
                  },
                  action: {
                    type: 'navigate',
                    to: 'IntroToPrayer',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Why should we pray?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhyPray',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Does God answer prayer?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'DoesGodAnswer',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'How should we pray?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'HowShouldPray',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Model prayer',
                  },
                  action: {
                    type: 'navigate',
                    to: 'ModelPrayer',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'How can we develop a growing dependence on God through prayer?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'DevelopDependence',
                  },
                },
              ],
              subscreens: [
                {
                  id: 'IntroToPrayer',
                  title: 'Prayer',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Introduction to prayer',
                    },
                    {
                      type: 'Slide',
                      canClose: false,
                      contentDesign: 'tight',
                      contents: [
                        'Prayer is conversation with God. It is our direct access to a loving Creator who is personal and accessible and who cares about our lives. Praying is not our access to some cosmic genie who grants our every wish. While God does desire to answer our prayers according to His will, His greater desire is for us to cast our cares upon Him and to increase our dependence on Him. Prayer is also not simply cathartic. Prayer is a powerful means of connecting with the heart of God and even seeing things change as a result.',
                      ],
                    },
                  ],
                },
                {
                  id: 'WhyPray',
                  title: 'Prayer',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Why should we pray?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 16:23-24',
                        revealedButton: {
                          text: 'Full joy',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Philippians 4:6-7',
                        revealedButton: {
                          text: 'Peace',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Hebrews 4:14-16',
                        revealedButton: {
                          text: 'Jesus understands',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'James 5:16',
                        revealedButton: {
                          text: 'Confession; community; healing',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Exodus 32:11-14',
                        revealedButton: {
                          text: "Changes God's actions",
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Luke 22:41-42',
                        revealedButton: {
                          text: "Aligns us to God's will",
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'DoesGodAnswer',
                  title: 'Prayer',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Does God answer prayer?',
                    },
                    {
                      type: 'Slide',
                      design: 'primary',
                      headerText: 'Is prayer always answered?',
                      canClose: false,
                      contentDesign: 'tight',
                      contents: [],
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 John 5:14',
                        revealedButton: {
                          text: 'God hears',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Matthew 21:22',
                        revealedButton: {
                          text: 'According to faith',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'John 14:13',
                        revealedButton: {
                          text: "According to Jesus' character",
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'James 4:3',
                        revealedButton: {
                          text: 'Not selfish prayer',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Corinthians 12:8-10',
                        revealedButton: {
                          text: 'Sometimes the answer is "No" for a bigger purpose',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Luke 22:41-42',
                        revealedButton: {
                          text: "Aligns us to God's will",
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'HowShouldPray',
                  title: 'Prayer',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'How should we pray?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Luke 18:9-14',
                        revealedButton: {
                          text: 'Humbly',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 Thessalonians 5:17',
                        revealedButton: {
                          text: 'Continually',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 8:26-28',
                        revealedButton: {
                          text: 'Spirit intercedes',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Nehemiah 4:9',
                        revealedButton: {
                          text: 'Pray, then act in faith',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Matthew 7:7-11',
                        revealedButton: {
                          text: 'Ask; seek; knock',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Luke 11:13',
                        revealedButton: {
                          text: 'God delights to give the Holy Spirit',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'ModelPrayer',
                  title: 'Prayer',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Model prayer',
                    },
                    {
                      type: 'Slide',
                      canClose: false,
                      headerText: 'Matthew 6:9-13',
                      contentDesign: 'tight',
                      contents: [
                        {
                          type: 'ScrRangeDisplay',
                          reference: 'Matthew 6:9',
                          style: {
                            alignSelf: 'flex-start',
                            fontStyle: 'italic',
                          },
                        },
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'Praise God for His goodness; honor Him for His holiness.',
                            },
                          ],
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: 'Matthew 6:10',
                          style: {
                            alignSelf: 'flex-start',
                            fontStyle: 'italic',
                          },
                        },
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'Help me to desire Your desires and to allow You to use me in whatever ways you think best.',
                            },
                          ],
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: 'Matthew 6:11',
                          style: {
                            alignSelf: 'flex-start',
                            fontStyle: 'italic',
                          },
                        },
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'Meet the needs I have today.',
                            },
                          ],
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: 'Matthew 6:12',
                          style: {
                            alignSelf: 'flex-start',
                            fontStyle: 'italic',
                          },
                        },
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'Ask forgiveness of sin; see where you need to forgive others.',
                            },
                          ],
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: 'Matthew 6:13',
                          style: {
                            alignSelf: 'flex-start',
                            fontStyle: 'italic',
                          },
                        },
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'Watch over and protect us.',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'DevelopDependence',
                  title: 'Prayer',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText:
                        'How can we develop a growing dependence on God through prayer?',
                    },
                    {
                      type: 'Slide',
                      headerText: 'Make a plan',
                      contentDesign: 'tight',
                      contents: ['When will you make time to pray?'],
                    },
                    {
                      type: 'Slide',
                      headerText: 'Keep track of prayer requests',
                      contentDesign: 'tight',
                      contents: [
                        "Writing down what you are praying for is a good way to look back on God's faithfulness.",
                      ],
                    },
                    {
                      type: 'Slide',
                      headerText: 'Make a plan',
                      contentDesign: 'tight',
                      contents: [
                        'Make a conscious effort to make prayer a part of your day, moment by moment.',
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'Essentials',
          type: 'ContentListScreen',
          contents: [
            {
              type: 'Header',
              headerText: 'Essentials',
            },
            {
              type: 'ActionButton',
              text: 'The Great Commission',
              action: {
                type: 'navigate',
                to: 'The Great Commission',
              },
            },
            {
              type: 'ActionButton',
              text: 'Discipleship (Who, Why, & How)',
              action: {
                type: 'navigate',
                to: 'Discipleship',
              },
            },
          ],
          subscreens: [
            {
              id: 'The Great Commission',
              type: 'ContentListScreen',
              contents: [
                {
                  type: 'Header',
                  headerText: 'The Great Commission',
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What is discipleship?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'WhatIsDiscipleship',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Go Make',
                  },
                  action: {
                    type: 'navigate',
                    to: 'Go Make',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Disciples',
                  },
                  action: {
                    type: 'navigate',
                    to: 'Disciples',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'All Nations',
                  },
                  action: {
                    type: 'navigate',
                    to: 'All Nations',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Baptizing',
                  },
                  action: {
                    type: 'navigate',
                    to: 'Baptizing',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Teaching',
                  },
                  action: {
                    type: 'navigate',
                    to: 'Teaching',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Empowered',
                  },
                  action: {
                    type: 'navigate',
                    to: 'Empowered',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'God causes growth',
                  },
                  action: {
                    type: 'navigate',
                    to: 'God causes growth',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Cycles of discipleship',
                  },
                  action: {
                    type: 'navigate',
                    to: 'Cycles of discipleship',
                  },
                },
              ],
              subscreens: [
                {
                  id: 'WhatIsDiscipleship',
                  title: 'The Great Commission',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What is discipleship?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Matthew 28:18-20',
                        revealedButton: {
                          text: 'What is discipleship?',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'Go Make',
                  title: 'The Great Commission',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Go Make',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Romans 10:14-15',
                        revealedButton: {
                          text: 'Active/intentional',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'Disciples',
                  title: 'The Great Commission',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Disciples',
                    },
                    {
                      type: 'Slide',
                      headerText: 'Disciple',
                      design: 'primary',
                      contentDesign: 'tight',
                      contents: [
                        'Someone who learns how to grow, live, and express the Christian life and repeats the process with others.',
                      ],
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Timothy 2:2',
                        revealedButton: {
                          text: 'Replication',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'All Nations',
                  title: 'The Great Commission',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'All Nations',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Acts 1:8',
                      },
                    },
                    {
                      type: 'Slide',
                      headerText: 'A picture of nations from Acts 1:8',
                      design: 'primary',
                      contentDesign: 'tight',
                      contents: [
                        {
                          type: 'Image',
                          image: 'nations',
                          style: {
                            width: 216,
                            height: 384,
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'Baptizing',
                  title: 'The Great Commission',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Baptizing',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Corinthians 5:17-20',
                        revealedButton: {
                          text: 'New life; new purpose; part of a community',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'Teaching',
                  title: 'The Great Commission',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Teaching',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Deuteronomy 6:6-9',
                        revealedButton: {
                          text: 'Founded in Scripture',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Acts 4:20',
                        revealedButton: {
                          text: "Can't stop telling your experience",
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'Empowered',
                  title: 'The Great Commission',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Empowered',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '2 Peter 1:3-4',
                        revealedButton: {
                          text: 'God has given us all we need',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'God causes growth',
                  title: 'The Great Commission',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'God causes growth',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: '1 Corinthians 3:6-7',
                        revealedButton: {
                          text: 'Invested by people; produced by God',
                        },
                      },
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Galatians 3:3',
                        revealedButton: {
                          text: 'Saved by the Spirit; sanctified by the Spirit',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'Cycles of discipleship',
                  title: 'The Great Commission',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'Cycles of discipleship',
                    },
                    {
                      type: 'Image',
                      image: 'cycles-of-involvement',
                      style: {
                        width: 216,
                        height: 384,
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'Discipleship',
              type: 'ContentListScreen',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Discipleship',
                  subheaderText: '(Who, Why, & How)',
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'The motivation',
                  },
                  action: {
                    type: 'navigate',
                    to: 'TheMotivation',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Who?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'Who',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'Why?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'Why',
                  },
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'How?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'How',
                  },
                },
              ],
              subscreens: [
                {
                  id: 'TheMotivation',
                  title: 'Discipleship',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'What is our motivation?',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Revelation 7:9-10',
                        revealedButton: {
                          text: 'All nations worshiping before the Lamb',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'Who',
                  title: 'Discipleship',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'The "Who" of Discipleship',
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Luke 6:12-17',
                        revealedButton: {
                          text: 'Selection',
                        },
                      },
                    },
                    {
                      type: 'Slide',
                      design: 'primary',
                      headerText:
                        'Jesus chose a few people to invest deeply in.',
                      contents: [
                        'Why is important to choose to invest in a few people?',
                        {
                          type: 'ToggleButton',
                          design: 'answer',
                          text: 'Tap to reveal answer',
                          altButtons: [
                            {
                              design: 'answer',
                              text: 'Because it is impossible to invest in everyone',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'Slide',
                      design: 'primary',
                      contentDesign: 'tight',
                      headerText: 'How do you choose whom to invest in?',
                      style: {
                        borderBottomColor: '#00c7e2',
                      },
                      contents: [
                        {
                          type: 'HeaderText',
                          text: 'Faithful',
                          style: {
                            fontSize: 25,
                            color: '#007bc6',
                            alignSelf: 'flex-start',
                            fontWeight: '700',
                          },
                        },
                        {
                          type: 'HeaderText',
                          text: '2 Timothy 2:2',
                          style: {
                            fontSize: 23,
                            color: '#ff9700',
                            alignSelf: 'flex-start',
                            fontWeight: '700',
                          },
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: '2 Timothy 2:2',
                          style: {
                            paddingBottom: 15,
                          },
                        },
                        {
                          type: 'HeaderText',
                          text: 'Available',
                          style: {
                            fontSize: 25,
                            color: '#007bc6',
                            alignSelf: 'flex-start',
                            fontWeight: '700',
                          },
                        },
                        {
                          type: 'HeaderText',
                          text: 'Luke 9:57-62',
                          style: {
                            fontSize: 23,
                            color: '#ff9700',
                            alignSelf: 'flex-start',
                            fontWeight: '700',
                          },
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: 'Luke 9:57-62',
                          style: {
                            paddingBottom: 15,
                          },
                        },
                        {
                          type: 'HeaderText',
                          text: 'Teachable',
                          style: {
                            fontSize: 25,
                            color: '#007bc6',
                            alignSelf: 'flex-start',
                            fontWeight: '700',
                          },
                        },
                        {
                          type: 'HeaderText',
                          text: 'Acts 2:42',
                          style: {
                            fontSize: 23,
                            color: '#ff9700',
                            alignSelf: 'flex-start',
                            fontWeight: '700',
                          },
                        },
                        {
                          type: 'ScrRangeDisplay',
                          reference: 'Acts 2:42',
                        },
                      ],
                    },
                    {
                      type: 'ScriptureSlide',
                      scripture: {
                        reference: 'Luke 14:25-33',
                        revealedButton: {
                          text: 'Count the cost',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'Why',
                  title: 'Discipleship',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'The "Why" of Discipleship',
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText: 'SlideHeading',
                      scripture: {
                        reference: 'Psalm 119:11',
                        revealedButton: {
                          text: 'Answer',
                        },
                      },
                    },
                  ],
                },
                {
                  id: 'How',
                  title: 'Discipleship',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'The "How" of Discipleship',
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText: 'SlideHeading',
                      scripture: {
                        reference: 'Psalm 119:11',
                        revealedButton: {
                          text: 'Answer',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'How to',
          type: 'ContentListScreen',
          design: 'tight',
          contents: [
            {
              type: 'Header',
              headerText: 'How to use this app',
              lineTexts: [
                'To grow in your faith, there is no better place to turn than allowing the Bible to work in your heart. Scripture is the foundation for this material.',
              ],
              design: 'screen',
            },
            {
              type: 'Slide',
              canClose: false,
              headerText: 'The format of this material is simple:',
              contentDesign: 'tight',
              contents: [
                '1. Read the question.\n2. Read what the Bible says to answer the question.\n3. Discuss each question based on the Scripture given.',
                'After each passage of Scripture, some hints are given to help guide the conversation and give an idea how each verse helps answer the question.',
              ],
            },
          ],
        },
        {
          id: 'About',
          type: 'ContentListScreen',
          design: 'tight',
          contents: [
            {
              type: 'Header',
              headerText: 'About Transferable Discipleship',
              lineTexts: [
                'Transferable Discipleship is a tool for Simple, Accessible, and Transferable Christian discipleship.',
              ],
              design: 'screen',
            },
            {
              type: 'Slide',
              headerText: 'Vision',
              contentDesign: 'tight',
              contents: [
                '"Go and make disciples..." That is the goal. From my years of making disciples on college campuses, I have found great resources that work well from staff to student. After that, it becomes difficult to see discipleship continue to others. My goal was to figure out how to make discipleship Simple, Accessible, and Transferable.',
              ],
            },
            {
              type: 'Slide',
              headerText: 'Simple',
              contentDesign: 'tight',
              contents: [
                'The content is set up in a simple question-and-Scripture format. This way, a person can simply sit down with someone else, read through the questions, and see how the Bible answers those questions.',
              ],
            },
            {
              type: 'Slide',
              headerText: 'Accessible',
              contentDesign: 'tight',
              contents: [
                "Sometimes, it can be difficult to know where to go to find the discipleship material you need. Then, when the person you disciple wants to disciple someone else, they may not know where to find what material you followed with them. Since this is a free app, it's available to everyone.",
              ],
            },
            {
              type: 'Slide',
              headerText: 'Transferable',
              contentDesign: 'tight',
              contents: [
                "Jesus spent three years with a group of guys, and those eleven guys changed the world. They didn't keep what Jesus taught them to themselves, and they also didn't wait until they had it all figured out to begin helping others. This material is not all-inclusive, but it contains what I think are some of the most important concepts a Christian needs to grow in and share with others. It is intended for quick replication. After finishing the Basics and the Essentials, a person is challenged to use the Basics and Essentials to disciple someone else.",
              ],
            },
            {
              type: 'Slide',
              headerText: 'Feedback?',
              contentDesign: 'tight',
              contents: [
                'Found a problem? Want a feature? Other feedback?',
                {
                  type: 'ActionButton',
                  text: 'Let us know',
                  design: 'answer',
                  action: {
                    type: 'link',
                    to: 'https://github.com/tjcouch1/transferable-discipleship/issues',
                  },
                },
              ],
            },
            {
              type: 'Slide',
              headerText: 'Create Your Own Discipleship App',
              contentDesign: 'tight',
              contents: [
                'This app was created using discipleship‑app‑template. Want to make your own discipleship app like this one?',
                {
                  type: 'ActionButton',
                  design: 'answer',
                  text: 'Fork the template on GitHub!',
                  action: {
                    type: 'link',
                    to: 'https://github.com/tjcouch1/discipleship%2Dapp%2Dtemplate',
                  },
                },
              ],
            },
            {
              type: 'Slide',
              headerText: 'Credits and Licensing',
              contentDesign: 'tight',
              contents: [
                "- Disciple-making content of the app compiled by TJ Couch.\n- discipleship‑app‑template developed by TJ Couch.\n- Scripture quoted from World English Bible (WEB).\n- Scripture data retrieved and cached from Tim Morgan's bible-api.com",
                {
                  type: 'ActionButton',
                  design: 'answer',
                  text: 'More Licensing Info',
                  action: {
                    type: 'navigate',
                    to: 'Credits',
                  },
                },
              ],
            },
          ],
          subscreens: [
            {
              id: 'Credits',
              type: 'ContentListScreen',
              design: 'tight',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Credits and Attributions',
                  design: 'screen',
                  lineTexts: [
                    'Thanks to all the many people who made this app possible.',
                  ],
                },
                {
                  type: 'Slide',
                  headerText: 'Transferable Discipleship',
                  contentDesign: 'tight',
                  contents: [
                    'Transferable Discipleship Copyright 2023 TJ Couch.\ntjcouch1@gmail.com\nLicensed under the GPL-3.0-only License.\nMore information on the Software Licenses page linked below.',
                  ],
                },
                {
                  type: 'Slide',
                  headerText: 'Discipleship App Template',
                  contentDesign: 'tight',
                  contents: [
                    'This app was created using discipleship‑app‑template Copyright 2023 TJ Couch.\ntjcouch1@gmail.com\nLicensed under the GPL-3.0-only License.\nMore information on the Software Licenses page linked below.',
                  ],
                },
                {
                  type: 'Slide',
                  headerText: 'Scripture',
                  contentDesign: 'tight',
                  contents: [
                    'The Scripture included in this app is from the World English Bible translation. The World English Bible is public domain.',
                    {
                      type: 'ActionButton',
                      design: 'answer',
                      text: 'WorldEnglish.Bible',
                      action: {
                        type: 'link',
                        to: 'https://worldenglish.bible/',
                      },
                    },
                  ],
                },
                {
                  type: 'Slide',
                  headerText: 'Fonts',
                  contentDesign: 'tight',
                  contents: [
                    '- Libre Franklin is licensed under the SIL Open Font License Version 1.1.\nMore information on the Software Licenses page linked below.',
                    {
                      type: 'ActionButton',
                      design: 'answer',
                      text: 'Libre Franklin GitHub',
                      action: {
                        type: 'link',
                        to: 'https://github.com/impallari/Libre-Franklin',
                      },
                    },
                    '- Open Sauce One is licensed under the SIL Open Font License Version 1.1.\nMore information on the Software Licenses page linked below.',
                    {
                      type: 'ActionButton',
                      design: 'answer',
                      text: 'Open Sauce GitHub',
                      action: {
                        type: 'link',
                        to: 'https://github.com/marcologous/Open-Sauce-Fonts',
                      },
                    },
                  ],
                },
                {
                  type: 'Slide',
                  headerText: 'Software Licenses',
                  contentDesign: 'tight',
                  contents: [
                    'This software was created using many amazing libraries including React Native and Expo. Beware there are many licenses to display on the following page. It will take a long time to load.',
                    {
                      type: 'ActionButton',
                      design: 'answer',
                      text: 'Software License Info',
                      action: {
                        type: 'navigate',
                        to: 'app:/__licenses',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/*
Template
{
              id: 'Prayer',
              type: 'ContentListScreen',
              contents: [
                {
                  type: 'Header',
                  headerText: 'Prayer',
                },
                {
                  type: 'ActionButton',
                  text: {
                    text: 'What is the relationship between God & man?',
                  },
                  action: {
                    type: 'navigate',
                    to: 'RelGodMan',
                  },
                },
              ],
              subscreens: [
                {
                  id: 'ScreenId',
                  title: 'Prayer',
                  type: 'ContentListScreen',
                  contents: [
                    {
                      type: 'Header',
                      headerText: 'ScreenTitle',
                    },
                    {
                      type: 'ScriptureSlide',
                      headerText: 'SlideHeading',
                      scripture: {
                        reference: 'Psalm 119:11',
                        revealedButton: {
                          text: 'Answer',
                        },
                      },
                    },
                  ],
                },
              ],
            },
*/

/** Screen data for software license info. Accessed on path `app:/__licenses` */
const licensesScreen = require('../../assets/data/licenses/licenses.json');

function assertScreenIdIsValid(screenId: string) {
  if (!screenId)
    throw new Error(
      `Screen id ${screenId} is not valid! Must provide a non-empty string`,
    );
  if (screenId === '..')
    throw new Error(
      `Screen id ${screenId} is not valid! Cannot use reserved words`,
    );
  if (screenId.includes(PATH_DELIMITER))
    throw new Error(
      `Screen id ${screenId} is not valid! Cannot use ${PATH_DELIMITER} in screen id`,
    );
}

/**
 * Recursively copies screens over to screenMap following down currentPath
 * @param screenMap map to add screens to
 * @param currentPath path to add current screens to
 * @param screens screens to add to the screenMap. Note that these are cloned and modified
 * @returns screenMap
 */
function addSubscreensToMap(
  screenMap: ScreenMap,
  currentPath: string,
  screens: ScreenData[] | undefined,
): ScreenMap {
  screens?.forEach(screen => {
    assertScreenIdIsValid(screen.id);

    const screenPath = pathJoin(currentPath, screen.id);

    if (screenMap.has(screenPath))
      throw new Error(`Duplicate screen path! ${screenPath}`);

    const screenClone = { ...screen };

    screenMap.set(screenPath, screenClone);

    // Preserve original id as title if a title was not provided
    if (!screenClone.title && screenClone.title !== '')
      screenClone.title = screenClone.id;

    // Overwrite the existing id with the full path
    screenClone.id = screenPath;

    addSubscreensToMap(screenMap, screenPath, screenClone.subscreens);
  });

  return screenMap;
}

/**
 * Transforms saved app data into a format we can use in the app.
 *
 * Primarily maps subscreens into their own screens
 *
 * @param appData the serialized app data to transform
 * @returns app data to use in the app
 */
function deserializeAppData(appData: SerializedAppData): AppData {
  return {
    ...appData,
    initialScreen: pathJoin(ROOT_PATH, appData.initialScreen),
    screens: addSubscreensToMap(new Map<string, ScreenData>(), ROOT_PATH, [
      ...appData.screens,
      licensesScreen,
    ]),
  };
}

const appScreens = deserializeAppData(serializedAppDataNew);

export const getAppScreens = () => appScreens;

/**
 * Get the information a screen needs to display
 * @param path The screen path to get (aka screen id)
 * @returns Screen information
 */
export const getScreenData = (path: string): ScreenData =>
  appScreens.screens.get(path) || ({ id: 'NOT_FOUND' } as ScreenData);

function forEachContentOfContents(
  contents: ContentData[],
  callback: (content: ContentData) => void,
) {
  if (!contents) return;

  contents.forEach(content => {
    if (!content) return;

    callback(content);
    if ((content as ContentListData).contents)
      forEachContentOfContents((content as ContentListData).contents, callback);
  });
}

/** Runs a callback on every content in the screens recursively */
export function forEachContent(callback: (content: ContentData) => void) {
  appScreens.screens.forEach(screen => {
    if ((screen as ContentListScreenData).contents)
      forEachContentOfContents(
        (screen as ContentListScreenData).contents,
        callback,
      );
  });
}
