export function getHomesOrigin(stage: string): string {
  switch (true) {
    case stage === 'test': {
      return 'https://www-test.develop.homes.co.jp';
    }
    case stage === 'targets': {
      return 'https://www-pool.homes.co.jp';
    }
    case stage === 'live': {
      return 'https://www.homes.co.jp';
    }
    case stage === 'local': {
      return 'http://localhost:8000';
    }
    // Ephemeral環境で実行する場合には pr:<対象PR番号> を指定できる
    case /^pr:[0-9]+$/.test(stage): {
      const prNumber = stage.split(':')[1];
      return `https://machimusubi-web-current${prNumber}.develop.homes.co.jp`;
    }
  }

  // 有効な値が指定されていない場合は、テスト環境に対してテストを実行する
  return 'https://www-test.develop.homes.co.jp';
}
