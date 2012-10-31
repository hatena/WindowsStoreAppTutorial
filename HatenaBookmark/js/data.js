(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    var feedUrl = "http://b.hatena.ne.jp/hotentry.rss";
    feedUrl = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json&num=999&q=" + encodeURIComponent(feedUrl);

    var categories = [
        { key: "group1", title: "最近の人気エントリー", subtitle: "はてなで人気の話題", description: "最近はてなブックマークで人気のある話題です" },
    ];

    // XMLHttpRequest によるデータの取得よりも先にエントリ一覧の WinJS.UI.ListView が表示される可能性もありますが,
    // ListView が表示された後でも WinJS.Binding.List オブジェクトの変化に応じて ListView の表示も変化するので, データ取得
    // タイミングを気にする必要はありません.
    // 一方で, XMLHttpRequest によるデータ取得に失敗した場合の処理は今回は書かれていませんが, 実際にリリースされるアプリ作成の
    // 際には, 通信に失敗した旨のエラーメッセージをユーザーに表示するなどの処理が必要となります.
    WinJS.xhr({ url: feedUrl })
        .done(function complete(result) {
            var jsonData = JSON.parse(result.response);
            jsonData.responseData.feed.entries.forEach(function (item) {
                item.group = categories[0];
                item.counterImageURL = "http://b.st-hatena.com/entry/image/" + item.link; // 画像APIのURLを追加する
                list.push(item);
            });
        });

    /* サンプルデータは表示しないようにコメントアウトしておきます
    generateSampleData().forEach(function (item) {
        list.push(item);
    });
    */

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    // 項目の参照を取得します。グループ キーと項目のタイトルを
    // 簡単にシリアル化できる、項目への一意の参照として使用します。
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // この関数は、指定されたグループに属する項目のみが格納された
    // WinJS.Binding.List を返します。
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // 指定されたグループ キーに対応する一意のグループを取得します。
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    // 指定された文字列配列から一意の項目を取得します。項目には
    // グループ キーと項目のタイトルが含まれます。
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    // アプリケーションのデータ リストに追加できるサンプル データの配列を
    // 返します。 
    /* // サンプルデータを生成するためにプロジェクトテンプレートに含まれていた関数ですが,
       // このプロジェクトの中では使用されなくなっています.
    function generateSampleData() {
        var itemContent = "<p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat";
        var itemDescription = "Item Description: Pellentesque porta mauris quis interdum vehicula urna sapien ultrices velit nec venenatis dui odio in augue cras posuere enim a cursus convallis neque turpis malesuada erat ut adipiscing neque tortor ac erat";
        var groupDescription = "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante";

        // これらの 3 つの文字列は、プレースホルダー イメージをエンコードします。
        // 実際のデータで backgroundImage プロパティをイメージの URL に設定できます。
        var darkGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
        var lightGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
        var mediumGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC";

        // これらの各サンプル グループには、個別に表示する一意のキーが
        // 必要です。
        var sampleGroups = [
            { key: "group1", title: "最近の人気エントリー", subtitle: "はてなで人気の話題", backgroundImage: darkGray, description: "最近はてなブックマークで人気のある話題です" },
        ];

        // これらの各サンプル項目には、特定のグループへの参照が
        // 必要です。
        var sampleItems = [
              { group: sampleGroups[0], title: "人気記事: 1", subtitle: "これはすごい", description: "概要がここにはいります。", content: "本文がここにはいります", backgroundImage: lightGray },
              { group: sampleGroups[0], title: "人気記事: 2", subtitle: "これはきれい", description: "概要がここにはいります。", content: "本文がここにはいります", backgroundImage: darkGray },
              { group: sampleGroups[0], title: "人気記事: 3", subtitle: "これはべんり", description: "概要がここにはいります。", content: "本文がここにはいります", backgroundImage: mediumGray },
              { group: sampleGroups[0], title: "人気記事: 4", subtitle: "これはやばい", description: "概要がここにはいります。", content: "本文がここにはいります", backgroundImage: darkGray },
              { group: sampleGroups[0], title: "人気記事: 5", subtitle: "これはひどい", description: "概要がここにはいります。", content: "本文がここにはいります", backgroundImage: mediumGray }
        ];

        return sampleItems;
    }
    */
})();
