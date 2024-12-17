// ■ まちむすびのutag_dataのパラメータの注意点
// - page_subcategory_typeは未定義
// - indiv_id_loginはログインしているユーザーのみ値が存在。未ログインでは値無し。
// - login_statusはログイン時は `member`、未ログイン時は `guest`
//
// Tealiumのパラメータ定義書は以下を参照
// @see https://docs.google.com/spreadsheets/d/1ciYbgmBPRV2nv2hsRq9PG8nb_ZzohtIRrP49Fd2a4do/edit#gid=0

import {homesV5OemId, userAgent} from '../../../utils/constants';

type TealiumParamValue = string | string[] | number | number[];
type TealiumParamMatcher = (v: TealiumParamValue) => boolean;
interface TealiumTestCase {
  path: string;
  description: string;
  userAgent: string;
  expected: Record<string, TealiumParamValue | TealiumParamMatcher | undefined>;
}
interface TealiumTestConfig {
  testCases: TealiumTestCase[];
}

const targetPagesForOemIdCheck = [
  {path: '/machimusubi/', name: 'まちむすびTOP'},
  {
    path: '/machimusubi/tokyo/lifestyle/',
    name: 'まちむすびライフスタイルから探す',
  },
  {
    path: '/machimusubi/tokyo/lifestyle/st-list/?tag_id=3,64,65',
    name: 'まちむすびライフスタイル駅一覧',
  },
  {
    path: '/machimusubi/tokyo/lifestyle/64/',
    name: 'まちむすび単一ライフスタイル駅一覧',
  },
  {
    path: '/machimusubi/osaka/line/',
    name: 'まちむすび路線から探す',
  },
  {
    path: '/machimusubi/fukuoka/kagoshimahonsen-line/',
    name: 'まちむすび路線駅一覧',
  },
  {
    path: '/machimusubi/kanagawa/yokohama_00004-st/',
    name: 'まちむすび駅詳細',
  },
];

const tealiumTestConfig: TealiumTestConfig = {
  testCases: [
    // デバイス判定によってoem_idの差し替えができていることの確認ケース
    // 全ページに対してpc, sp, tabletのUserAgentでアクセスして、
    // oem_id が適切にセットされていることをチェックする
    ...targetPagesForOemIdCheck.flatMap(page => {
      const deviceTypes = ['pc', 'sp', 'tablet'] as const;
      return deviceTypes.map(deviceType => ({
        path: page.path,
        description: `${deviceType}のUserAgentで${page.name}にアクセスするケース`,
        userAgent: userAgent[deviceType],
        expected: {
          oem_id: homesV5OemId[deviceType],
        },
      }));
    }),

    // 各ページごとにデバイス判定に依存しないパラメータが正しく格納できていることの確認ケース
    {
      path: '/machimusubi/',
      description: '未ログイン状態でまちむすびTOPにアクセスするケース',
      userAgent: userAgent.pc,
      expected: {
        tealium_event: 'web_machimusubi_top_view',
        oem_id: homesV5OemId.pc,
        market_type: 'chintai',
        page_type: 'top',
        page_category_type: 'machimusubi_top',
        page_subcategory_type: undefined,
        market_category_type: 'other',
        indiv_id_login: undefined,
        login_status: 'guest',
        service_type: 'machimusubi',
      },
    },
    {
      path: '/machimusubi/tokyo/lifestyle/',
      description:
        '未ログイン状態でまちむすびライフスタイル選択にアクセスするケース',
      userAgent: userAgent.pc,
      expected: {
        tealium_event: 'web_machimusubi_search_view',
        oem_id: homesV5OemId.pc,
        market_type: 'chintai',
        page_type: 'search',
        page_category_type: 'machimusubi_search_lifestyle',
        page_subcategory_type: undefined,
        market_category_type: 'other',
        indiv_id_login: undefined,
        login_status: 'guest',
        service_type: 'machimusubi',
      },
    },
    {
      path: '/machimusubi/tokyo/lifestyle/st-list/?tag_id=3%2C64%2C65',
      description:
        '未ログイン状態でまちむすびライフスタイル駅一覧にアクセスするケース',
      userAgent: userAgent.pc,
      expected: {
        tealium_event: 'web_machimusubi_list_view',
        oem_id: homesV5OemId.pc,
        market_type: 'chintai',
        page_type: 'list',
        page_category_type: 'machimusubi_list_lifestyle',
        page_subcategory_type: undefined,
        market_category_type: 'other',
        indiv_id_login: undefined,
        login_status: 'guest',
        prefecture_id: ['13'],
        lifestyle_id: ['3', '64', '65'],
        line_id: undefined,
        quantity: stationQuantityMatcher,
        service_type: 'machimusubi',
      },
    },
    {
      path: '/machimusubi/ibaraki/lifestyle/3/',
      description:
        '未ログイン状態でまちむすび単一ライフスタイル駅一覧にアクセスするケース',
      userAgent: userAgent.pc,
      expected: {
        tealium_event: 'web_machimusubi_list_view',
        oem_id: homesV5OemId.pc,
        market_type: 'chintai',
        page_type: 'list',
        page_category_type: 'machimusubi_list_lifestyle',
        page_subcategory_type: undefined,
        market_category_type: 'other',
        indiv_id_login: undefined,
        login_status: 'guest',
        prefecture_id: ['08'],
        lifestyle_id: ['3'],
        line_id: undefined,
        quantity: stationQuantityMatcher,
        service_type: 'machimusubi',
      },
    },
    {
      path: '/machimusubi/tokyo/line/',
      description: '未ログイン状態でまちむすび路線選択にアクセスするケース',
      userAgent: userAgent.pc,
      expected: {
        tealium_event: 'web_machimusubi_search_view',
        oem_id: homesV5OemId.pc,
        market_type: 'chintai',
        page_type: 'search',
        page_category_type: 'machimusubi_search_route_line',
        page_subcategory_type: undefined,
        market_category_type: 'other',
        indiv_id_login: undefined,
        login_status: 'guest',
        service_type: 'machimusubi',
      },
    },
    {
      path: '/machimusubi/hokkaido/hakodatehonsen-line/',
      description: '未ログイン状態でまちむすび駅一覧にアクセスするケース',
      userAgent: userAgent.pc,
      expected: {
        tealium_event: 'web_machimusubi_list_view',
        market_type: 'chintai',
        oem_id: homesV5OemId.pc,
        page_type: 'list',
        page_category_type: 'machimusubi_list_route_station',
        page_subcategory_type: undefined,
        market_category_type: 'other',
        indiv_id_login: undefined,
        login_status: 'guest',
        prefecture_id: ['01'],
        lifestyle_id: undefined,
        line_id: ['0378'],
        quantity: stationQuantityMatcher,
        service_type: 'machimusubi',
      },
    },
    {
      path: '/machimusubi/hokkaido/otaru_04206-st/',
      description:
        '未ログイン状態でまちむすび駅詳細にアクセスするケース（都道府県IDが1桁の都道府県の駅）',
      userAgent: userAgent.pc,
      expected: {
        tealium_event: 'web_machimusubi_detail_view',
        market_type: 'chintai',
        oem_id: homesV5OemId.pc,
        page_type: 'detail',
        page_category_type: 'machimusubi_detail',
        page_subcategory_type: undefined,
        market_category_type: 'other',
        indiv_id_login: undefined,
        login_status: 'guest',
        prefecture_id: ['01'],
        lifestyle_id: lifestyleIdMatcher,
        line_id: ['0378'],
        station_id: ['04206'],
        service_type: 'machimusubi',
      },
    },
    {
      path: '/machimusubi/fukuoka/amagi_07398-st/',
      description:
        '未ログイン状態でまちむすび駅詳細にアクセスするケース（ライフスタイルIDが紐づいていない駅のケース）',
      userAgent: userAgent.pc,
      expected: {
        tealium_event: 'web_machimusubi_detail_view',
        market_type: 'chintai',
        oem_id: homesV5OemId.pc,
        page_type: 'detail',
        page_category_type: 'machimusubi_detail',
        page_subcategory_type: undefined,
        market_category_type: 'other',
        indiv_id_login: undefined,
        login_status: 'guest',
        prefecture_id: ['40'],
        lifestyle_id: [],
        line_id: ['0690'],
        station_id: ['07398'],
        service_type: 'machimusubi',
      },
    },
  ],
};

export {tealiumTestConfig};

/**
 * quantity (該当駅数) のパラメータのマッチャ関数
 * quantity が満たすべき条件
 * - number[]
 * - 配列長が1
 * - 要素は 0以上であること
 */
function stationQuantityMatcher(v: TealiumParamValue): boolean {
  if (!Array.isArray(v)) {
    return false;
  }

  return v.length === 1 && typeof v[0] === 'number' && v[0] >= 0;
}

/**
 * ライフスタイルIDのパラメータのマッチャ関数
 * lifestyle_id が満たすべき条件
 * - string[]
 * - 配列長は1以上
 * - 要素は全て数値文字列であること
 */
function lifestyleIdMatcher(v: TealiumParamValue): boolean {
  if (!Array.isArray(v)) {
    return false;
  }

  return v.length >= 1 && isStringArray(v) && v.every(v => !isNaN(Number(v)));
}

function isStringArray(array: unknown[]): array is string[] {
  return array.filter(v => typeof v === 'string').length === array.length;
}
