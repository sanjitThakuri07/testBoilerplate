const dataset = [
  {
    id: 1,
    name: 'Page 1',
    type: '',
    label: 'General',
    parent: null,
    component: 'page',
    description:
      ' Title page is the first page of your inspection report. You can customise it below',
    placeholder: 'Page',
    isImageOpened: false,
    isPageDeleted: false,
  },
  {
    id: 'b19d6594-7b3a-44a4-a02e-f1fd38145c2e',
    name: 'Question',
    type: 'text',
    label: 'what is your name?',
    level: 0,
    media: [
      {
        title: '',
        documents: [
          'static/templates/b19d6594-7b3a-44a4-a02e-f1fd38145c2e/png-transparent-sonic-the-hedgehog-segasonic-the-hedgehog-sonic-sega-all-stars-racing-sonic-unleashed-sonic-colors-sonic-best-free-s-game-sonic-the-hedgehog-video-game-thumbnail.png',
        ],
      },
    ],
    notes: '',
    value: 'Sandeep shretha',
    action: [
      {
        id: 81,
        title: 'sdfgb',
        users: [
          {
            id: 3,
            notes: null,
            status: 'Active',
            deleted: false,
            role_id: null,
            user_id: 63,
            region_id: 1,
            can_set_pw: false,
            country_id: 2,
            created_at: '2023-05-04T05:28:02.784582+00:00',
            created_by: 17,
            updated_at: '2023-06-01T07:21:17.095796+00:00',
            location_id: 2,
            territory_id: 1,
            organization_id: 1,
            user_department_id: 1,
          },
        ],
        status: 2,
        deleted: false,
        document: [],
        due_date: '2023-06-09T09:56:00',
        is_issue: false,
        priority: 'High',
        module_id: null,
        object_id: null,
        created_by: 17,
        generic_id: null,
        description: '<p>dfghj</p>\n',
        inspection_id: null,
        completion_date: null,
        organization_id: 1,
        user_department: ['2'],
        activity_description: null,
      },
    ],
    parent: null,
    keyName: 'what is your name?__b19d6594-7b3a-44a4-a02e-f1fd38145c2e',
    logicId: '13d70db7-7692-406d-ad77-c04ba8c65852',
    trigger: {},
    imageImg: '',
    component: 'question',
    imageDesc: '',
    variables: {
      date: true,
      step: '1',
      time: true,
      format: 'text',
      max_value: '20',
      min_value: '1',
      temperatureFormat: 'Celcius',
    },
    imageLabel: '',
    parentPage: 1,
    placeholder: 'New Question',
    annotationImg: '',
    isImageOpened: false,
    response_type: 'TEXT_001',
    annotationDesc: '',
    sectionActions: {
      required: false,
      duplicate: false,
      repeatThisSection: false,
    },
    annotationLabel: '',
    response_choice: 'default',
    logicReferenceId: null,
    titleAndDescValue: '',
    titleAndDescActions: {
      required: false,
      duplicate: false,
    },
    globalLogicReferenceId: null,
  },
  {
    id: 'c0832efb-4c93-46dd-a647-dc58a9c80b45',
    name: 'New Question',
    type: 'number',
    label: "What's your age?",
    level: 0,
    notes: '',
    value: '11',
    parent: null,
    keyName: "What's your age?__c0832efb-4c93-46dd-a647-dc58a9c80b45",
    logicId: '501ba6ca-0180-4a88-896c-4d2bf15ebbaf',
    trigger: {},
    imageImg: '',
    component: 'question',
    imageDesc: '',
    variables: {
      date: true,
      step: '1',
      time: true,
      format: 'text',
      max_value: '20',
      min_value: '1',
      temperatureFormat: 'Celcius',
    },
    imageLabel: '',
    parentPage: 1,
    imageFields: null,
    placeholder: 'New Question',
    annotationImg: '',
    isImageOpened: false,
    response_type: 'NUM_001',
    annotationDesc: '',
    sectionActions: {
      required: false,
      duplicate: false,
      repeatThisSection: false,
    },
    annotationLabel: '',
    response_choice: 'default',
    logicReferenceId: null,
    titleAndDescValue: '',
    titleAndDescActions: {
      required: false,
      duplicate: false,
    },
    globalLogicReferenceId: null,
  },
  {
    id: '501ba6ca-0180-4a88-896c-4d2bf15ebbaf',
    name: 'logic',
    label: 'logic',
    level: 0,
    logics: [
      {
        id: 'd81e3236-3e55-4d4d-adcd-6c98a6fb346f',
        value: ['20'],
        trigger: [
          {
            name: 'Ask Question',
            value: ['edc748b8-cfb2-4c55-aaa1-d61ee098482f'],
          },
        ],
        condition: 'less than',
        linkQuestions: ['edc748b8-cfb2-4c55-aaa1-d61ee098482f'],
      },
    ],
    parent: 'c0832efb-4c93-46dd-a647-dc58a9c80b45',
    required: false,
    component: 'logic',
    imageLabel: '',
    flaggedResponse: [],
    logicReferenceId: null,
    multipleSelection: false,
    globalLogicReferenceId: null,
  },
  {
    id: 'edc748b8-cfb2-4c55-aaa1-d61ee098482f',
    name: 'New Question',
    type: 'Array',
    label: 'Are you student?',
    level: 1,
    notes: '',
    value: ['Yes'],
    parent: '501ba6ca-0180-4a88-896c-4d2bf15ebbaf',
    keyName: 'Are you student?__edc748b8-cfb2-4c55-aaa1-d61ee098482f',
    logicId: 'c04661b2-407d-433f-8852-db51e9beaac8',
    trigger: {},
    imageImg: '',
    component: 'question',
    imageDesc: '',
    variables: {
      date: true,
      step: '1',
      time: true,
      format: 'text',
      max_value: '20',
      min_value: '1',
      temperatureFormat: 'Celcius',
    },
    imageLabel: '',
    imageFields: null,
    placeholder: 'New Question',
    annotationImg: '',
    isImageOpened: false,
    response_type: 14,
    annotationDesc: '',
    sectionActions: {
      required: false,
      duplicate: false,
      repeatThisSection: false,
    },
    annotationLabel: '',
    response_choice: 'multiple',
    logicReferenceId:
      '501ba6ca-0180-4a88-896c-4d2bf15ebbaf[logicParentId]d81e3236-3e55-4d4d-adcd-6c98a6fb346f',
    titleAndDescValue: '',
    titleAndDescActions: {
      required: false,
      duplicate: false,
    },
    globalLogicReferenceId:
      '501ba6ca-0180-4a88-896c-4d2bf15ebbaf[logicParentId]d81e3236-3e55-4d4d-adcd-6c98a6fb346f',
  },
  {
    id: 'c04661b2-407d-433f-8852-db51e9beaac8',
    name: 'logic',
    type: 'number',
    label: 'logic',
    level: 1,
    logics: [
      {
        id: 'dc861eb3-0f93-41de-be3c-d795d783f988',
        value: 'Yes',
        trigger: [
          {
            name: 'Ask Question',
            value: [
              'd9229e39-e196-43e0-a028-dfa6b998da6a',
              '50081ed2-33a3-4a08-a020-7d8257c3f7fc',
              'e40cb59e-9962-4398-ab5d-f142819ce416',
              '83113ba3-432f-4f43-be72-b76931b6008b',
            ],
          },
        ],
        condition: 'is',
        linkQuestions: [
          '83113ba3-432f-4f43-be72-b76931b6008b',
          'e40cb59e-9962-4398-ab5d-f142819ce416',
          '50081ed2-33a3-4a08-a020-7d8257c3f7fc',
          'd9229e39-e196-43e0-a028-dfa6b998da6a',
        ],
      },
    ],
    parent: 'edc748b8-cfb2-4c55-aaa1-d61ee098482f',
    required: false,
    component: 'logic',
    imageLabel: '',
    selectField: true,
    logicOptions: ['Yes', 'No', 'N/A'],
    response_type: 'NUM_001',
    flaggedResponse: ['Yes'],
    response_choice: 'default',
    logicReferenceId:
      '501ba6ca-0180-4a88-896c-4d2bf15ebbaf[logicParentId]d81e3236-3e55-4d4d-adcd-6c98a6fb346f',
    multipleSelection: false,
    globalLogicReferenceId:
      '501ba6ca-0180-4a88-896c-4d2bf15ebbaf[logicParentId]d81e3236-3e55-4d4d-adcd-6c98a6fb346f',
  },
  {
    id: 'b92a8469-5071-4add-b056-b3dcbd8b7196',
    name: 'logic',
    label: 'logic',
    level: 2,
    logics: [],
    parent: '83113ba3-432f-4f43-be72-b76931b6008b',
    required: false,
    component: 'logic',
    imageLabel: '',
    flaggedResponse: [],
    logicReferenceId:
      'c04661b2-407d-433f-8852-db51e9beaac8[logicParentId]dc861eb3-0f93-41de-be3c-d795d783f988',
    multipleSelection: false,
    globalLogicReferenceId:
      '501ba6ca-0180-4a88-896c-4d2bf15ebbaf[logicParentId]d81e3236-3e55-4d4d-adcd-6c98a6fb346f',
  },
  {
    id: 'ac21344f-1bf5-4d1a-9632-aba42a34ce08',
    name: 'logic',
    label: 'logic',
    level: 2,
    logics: [],
    parent: 'e40cb59e-9962-4398-ab5d-f142819ce416',
    required: false,
    component: 'logic',
    imageLabel: '',
    flaggedResponse: [],
    logicReferenceId:
      'c04661b2-407d-433f-8852-db51e9beaac8[logicParentId]dc861eb3-0f93-41de-be3c-d795d783f988',
    multipleSelection: false,
    globalLogicReferenceId:
      '501ba6ca-0180-4a88-896c-4d2bf15ebbaf[logicParentId]d81e3236-3e55-4d4d-adcd-6c98a6fb346f',
  },
  {
    id: '4c20455f-b9f4-4117-af89-b9f0506fb6e9',
    name: 'logic',
    label: 'logic',
    level: 2,
    logics: [],
    parent: '50081ed2-33a3-4a08-a020-7d8257c3f7fc',
    required: false,
    component: 'logic',
    imageLabel: '',
    flaggedResponse: [],
    logicReferenceId:
      'c04661b2-407d-433f-8852-db51e9beaac8[logicParentId]dc861eb3-0f93-41de-be3c-d795d783f988',
    multipleSelection: false,
    globalLogicReferenceId:
      '501ba6ca-0180-4a88-896c-4d2bf15ebbaf[logicParentId]d81e3236-3e55-4d4d-adcd-6c98a6fb346f',
  },
  {
    id: 'd9229e39-e196-43e0-a028-dfa6b998da6a',
    name: 'New Question',
    type: 'text',
    label: 'Which college?',
    level: 2,
    notes: '',
    value: 'sasas',
    parent: 'c04661b2-407d-433f-8852-db51e9beaac8',
    keyName: 'Which college?__d9229e39-e196-43e0-a028-dfa6b998da6a',
    logicId: '788eae54-3171-434a-8b57-671c7d5ada58',
    trigger: {},
    imageImg: '',
    component: 'question',
    imageDesc: '',
    variables: {
      date: true,
      step: '1',
      time: true,
      format: 'text',
      max_value: '20',
      min_value: '1',
      temperatureFormat: 'Celcius',
    },
    imageLabel: '',
    imageFields: null,
    placeholder: 'New Question',
    annotationImg: '',
    isImageOpened: false,
    response_type: 'TEXT_001',
    annotationDesc: '',
    sectionActions: {
      required: false,
      duplicate: false,
      repeatThisSection: false,
    },
    annotationLabel: '',
    response_choice: 'default',
    logicReferenceId:
      'c04661b2-407d-433f-8852-db51e9beaac8[logicParentId]dc861eb3-0f93-41de-be3c-d795d783f988',
    titleAndDescValue: '',
    titleAndDescActions: {
      required: false,
      duplicate: false,
    },
    globalLogicReferenceId:
      '501ba6ca-0180-4a88-896c-4d2bf15ebbaf[logicParentId]d81e3236-3e55-4d4d-adcd-6c98a6fb346f',
  },
  {
    id: '788eae54-3171-434a-8b57-671c7d5ada58',
    name: 'logic',
    label: 'logic',
    level: 2,
    logics: [],
    parent: 'd9229e39-e196-43e0-a028-dfa6b998da6a',
    required: false,
    component: 'logic',
    imageLabel: '',
    flaggedResponse: [],
    logicReferenceId:
      'c04661b2-407d-433f-8852-db51e9beaac8[logicParentId]dc861eb3-0f93-41de-be3c-d795d783f988',
    multipleSelection: false,
    globalLogicReferenceId:
      '501ba6ca-0180-4a88-896c-4d2bf15ebbaf[logicParentId]d81e3236-3e55-4d4d-adcd-6c98a6fb346f',
  },
  {
    id: '13d70db7-7692-406d-ad77-c04ba8c65852',
    name: 'logic',
    label: 'logic',
    level: 0,
    logics: [],
    parent: 'b19d6594-7b3a-44a4-a02e-f1fd38145c2e',
    required: false,
    component: 'logic',
    imageLabel: '',
    parentPage: 1,
    flaggedResponse: [],
    logicReferenceId: null,
    multipleSelection: false,
    globalLogicReferenceId: null,
  },
  {
    id: '31105872-fd2b-4067-a549-fbe4432c12d7',
    name: 'Page 1',
    type: '',
    label: 'Page',
    parent: null,
    component: 'page',
    description:
      ' Title page is the first page of your inspection report. You can customise it below',
    placeholder: 'Page',
    isImageOpened: false,
    isPageDeleted: false,
  },
  {
    id: 'a46d6498-4ced-426a-83c7-ae238f8b77ac',
    name: 'Question',
    type: 'Array',
    label: 'Where do you live?',
    level: 0,
    media: [
      {
        title: '',
        documents: [
          'static/templates/a46d6498-4ced-426a-83c7-ae238f8b77ac/Screen Shot 2023-05-29 at 23.16.54.png',
        ],
      },
    ],
    notes: '',
    value: ['Lalitpur', 'Kathmandu', 'Biratnagar'],
    parent: null,
    keyName: 'Where do you live?__a46d6498-4ced-426a-83c7-ae238f8b77ac',
    logicId: '693cb2ee-ee40-4aa5-b231-917638f78936',
    trigger: {},
    imageImg: '',
    component: 'question',
    imageDesc: '',
    variables: {
      date: true,
      step: '1',
      time: true,
      format: 'text',
      max_value: '20',
      min_value: '1',
      temperatureFormat: 'Celcius',
    },
    imageLabel: '',
    parentPage: '31105872-fd2b-4067-a549-fbe4432c12d7',
    placeholder: 'New Question',
    flaggedValue: ['Lalitpur', 'Kathmandu'],
    annotationImg: '',
    isImageOpened: false,
    response_type: 16,
    annotationDesc: '',
    sectionActions: {
      required: false,
      duplicate: false,
      repeatThisSection: false,
    },
    annotationLabel: '',
    flaggedResponse: ['Kathmandu'],
    response_choice: 'multiple',
    logicReferenceId: null,
    titleAndDescValue: '',
    titleAndDescActions: {
      required: false,
      duplicate: false,
    },
    globalLogicReferenceId: null,
  },
  {
    id: '12fbaeff-a203-4645-afcc-23f4c972d965',
    name: 'New Question',
    type: 'signature',
    label: 'Signature',
    level: 0,
    notes: '',
    value: '',
    parent: null,
    keyName: 'Signature__12fbaeff-a203-4645-afcc-23f4c972d965',
    logicId: 'da99e3ff-131d-4a26-8150-33018c3f3c9a',
    trigger: {},
    imageImg: '',
    component: 'question',
    imageDesc: '',
    variables: {
      date: true,
      step: '1',
      time: true,
      format: 'text',
      max_value: '20',
      min_value: '1',
      temperatureFormat: 'Celcius',
    },
    file_value: 'static/templates/12fbaeff-a203-4645-afcc-23f4c972d965/blob',
    imageLabel: '',
    parentPage: '31105872-fd2b-4067-a549-fbe4432c12d7',
    imageFields: null,
    placeholder: 'New Question',
    annotationImg: '',
    isImageOpened: false,
    response_type: 'SIGN_001',
    annotationDesc: '',
    sectionActions: {
      required: false,
      duplicate: false,
      repeatThisSection: false,
    },
    annotationLabel: '',
    response_choice: 'default',
    logicReferenceId: null,
    titleAndDescValue: '',
    titleAndDescActions: {
      required: false,
      duplicate: false,
    },
    globalLogicReferenceId: null,
  },
  {
    id: 'da99e3ff-131d-4a26-8150-33018c3f3c9a',
    name: 'logic',
    label: 'logic',
    level: 0,
    logics: [],
    parent: '12fbaeff-a203-4645-afcc-23f4c972d965',
    required: false,
    component: 'logic',
    imageLabel: '',
    flaggedResponse: [],
    logicReferenceId: null,
    multipleSelection: false,
    globalLogicReferenceId: null,
  },
  {
    id: '693cb2ee-ee40-4aa5-b231-917638f78936',
    name: 'logic',
    label: 'logic',
    level: 0,
    logics: [
      {
        id: 'ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
        value: 'Kathmandu',
        trigger: [
          {
            name: 'Ask Question',
            value: [
              '5407de36-1423-496b-b867-e116ead98cad',
              '7a936bcc-2437-428a-8c87-d54070d9693c',
              '4cb4d627-9fc7-443b-8506-3dc7609a4d52',
            ],
          },
        ],
        condition: 'is',
        linkQuestions: [
          '4cb4d627-9fc7-443b-8506-3dc7609a4d52',
          '7a936bcc-2437-428a-8c87-d54070d9693c',
          '5407de36-1423-496b-b867-e116ead98cad',
        ],
      },
    ],
    parent: 'a46d6498-4ced-426a-83c7-ae238f8b77ac',
    required: false,
    component: 'logic',
    imageLabel: '',
    parentPage: '31105872-fd2b-4067-a549-fbe4432c12d7',
    selectField: true,
    logicOptions: ['Biratnagar', 'Lalitpur', 'Kathmandu'],
    flaggedResponse: ['Kathmandu', 'Lalitpur'],
    logicReferenceId: null,
    multipleSelection: true,
    globalLogicReferenceId: null,
  },
  {
    id: '4cb4d627-9fc7-443b-8506-3dc7609a4d52',
    name: 'New Question',
    type: 'text',
    label: 'how is Kathmandu?',
    level: 1,
    notes: '',
    value: 'Good',
    parent: '693cb2ee-ee40-4aa5-b231-917638f78936',
    keyName: 'how is Kathmandu?__4cb4d627-9fc7-443b-8506-3dc7609a4d52',
    logicId: '810151b6-8483-4294-9153-2d273652c6c6',
    trigger: {},
    imageImg: '',
    component: 'question',
    imageDesc: '',
    variables: {
      date: true,
      step: '1',
      time: true,
      format: 'text',
      max_value: '20',
      min_value: '1',
      temperatureFormat: 'Celcius',
    },
    imageLabel: '',
    parentPage: '31105872-fd2b-4067-a549-fbe4432c12d7',
    imageFields: null,
    placeholder: 'New Question',
    annotationImg: '',
    isImageOpened: false,
    response_type: 'TEXT_001',
    annotationDesc: '',
    sectionActions: {
      required: false,
      duplicate: false,
      repeatThisSection: false,
    },
    annotationLabel: '',
    response_choice: 'default',
    logicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
    titleAndDescValue: '',
    titleAndDescActions: {
      required: false,
      duplicate: false,
    },
    globalLogicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
  },
  {
    id: '810151b6-8483-4294-9153-2d273652c6c6',
    name: 'logic',
    label: 'logic',
    level: 1,
    logics: [],
    parent: '4cb4d627-9fc7-443b-8506-3dc7609a4d52',
    required: false,
    component: 'logic',
    imageLabel: '',
    flaggedResponse: [],
    logicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
    multipleSelection: false,
    globalLogicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
  },
  {
    id: 'fb45c42b-7068-4935-b565-902401c31df5',
    name: 'logic',
    label: 'logic',
    level: 1,
    logics: [],
    parent: '7a936bcc-2437-428a-8c87-d54070d9693c',
    required: false,
    component: 'logic',
    imageLabel: '',
    flaggedResponse: [],
    logicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
    multipleSelection: false,
    globalLogicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
  },
  {
    id: '5407de36-1423-496b-b867-e116ead98cad',
    name: 'New Question',
    type: 'text',
    label: 'It is good?',
    level: 1,
    notes: '',
    value: 'yes',
    parent: '693cb2ee-ee40-4aa5-b231-917638f78936',
    keyName: 'It is good?__5407de36-1423-496b-b867-e116ead98cad',
    logicId: '51c3e1b5-e27a-4925-845d-d26906cf01d5',
    trigger: {},
    imageImg: '',
    component: 'question',
    imageDesc: '',
    variables: {
      date: true,
      step: '1',
      time: true,
      format: 'text',
      max_value: '20',
      min_value: '1',
      temperatureFormat: 'Celcius',
    },
    imageLabel: '',
    parentPage: '31105872-fd2b-4067-a549-fbe4432c12d7',
    imageFields: null,
    placeholder: 'New Question',
    annotationImg: '',
    isImageOpened: false,
    response_type: 'TEXT_001',
    annotationDesc: '',
    sectionActions: {
      required: false,
      duplicate: false,
      repeatThisSection: false,
    },
    annotationLabel: '',
    response_choice: 'default',
    logicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
    titleAndDescValue: '',
    titleAndDescActions: {
      required: false,
      duplicate: false,
    },
    globalLogicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
  },
  {
    id: '51c3e1b5-e27a-4925-845d-d26906cf01d5',
    name: 'logic',
    label: 'logic',
    level: 1,
    logics: [],
    parent: '5407de36-1423-496b-b867-e116ead98cad',
    required: false,
    component: 'logic',
    imageLabel: '',
    flaggedResponse: [],
    logicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
    multipleSelection: false,
    globalLogicReferenceId:
      '693cb2ee-ee40-4aa5-b231-917638f78936[logicParentId]ed6fb159-66f2-4a2a-866d-43e26b1f7b5c',
  },
];

const rawData = {
  id: 139,
  booking_id: 'BASBK0012',
  location: [
    {
      id: 6,
      name: 'Australia_copy_ae',
      inspection_type: 16,
      inspection_name: 'Engine Inspections updated',
      templates: [
        {
          id: 149,
          name: 'Farm Health and Safety Audit',
          template_data: [],
        },
        {
          id: 189,
          name: 'internal response',
          template_data: [],
        },
      ],
    },
    {
      id: 12,
      name: 'Chelsea',
      inspection_type: 7,
      inspection_name: 'fsd',
      templates: [
        {
          id: 172,
          name: 'Security Checklist',
          template_data: [
            {
              id: 170,
              status: null,
              status_name: null,
            },
            {
              id: 171,
              status: null,
              status_name: null,
            },
            {
              id: 169,
              status: null,
              status_name: null,
            },
          ],
        },
      ],
    },
  ],
};

const datasets = {
  id: 'aa004814-859e-43a6-bf9f-cc8429ceafe4',
  parent: null,
  component: 'question',
  parentPage: 1,
  response_type: 48,
  response_choice: 'internal',
  variables: {
    step: '1',
    min_value: '1',
    max_value: '20',
    date: true,
    time: true,
    temperatureFormat: 'Celcius',
    format: 'text',
  },
  type: 'Array',
  value: '',
  notes: '',
  label: 'New Question',
  placeholder: 'New Question',
  isImageOpened: false,
  logicReferenceId: null,
  globalLogicReferenceId: null,
  logicId: 'e90bff23-74fc-40bc-a486-b3d12a383c5f',
  level: 0,
  logicApi: {
    url: '/api/v1/main-category/',
    response_choice: 'internal',
    field: 'name',
    storeKey: 48,
  },
};