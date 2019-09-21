let config = {
    infiniteScroll: true,
    quoteNames: true
};

$(document).ready(() => {
    let params = (new URL(document.location)).searchParams;
    if (params.get("t") && config.infiniteScroll) infiniteScroll();
});

/**
 * This is the loader that is used to keep state as well as graphically display. CSS in css/loader.css
 */
class Loader {
    constructor(id) {
        this._id = id ? id : 'ext-loader';
        this.selector = `#${this._id}`;
        this.elem = $(`<div id='${this._id}' class="loader"/>`);
        $(".post:last").after(this.elem);
        this._isLoading = false;
        this.finishedLoading = false;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        if (value) this._show();
        else this._hide();
        this._isLoading = !!value;
    }

    _show() {
        this.elem.show();
    }

    _hide() {
        this.elem.hide();
    }
}

function infiniteScroll() {
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            startLoading();
        }
    });
    let blockQuoteCSS = "blockquote[author]::before {" +
        "content: attr(author) \" wrote:\";" +
        "font-weight: bold; " +
        "padding-left: 5px;" +
        "padding-bottom: 5px;}";
    addStyleString(blockQuoteCSS);
    parseQuotes($(".post"));
    parseHideTags();
}

let loader = new Loader();

function startLoading() {
    if (loader.isLoading || loader.finishedLoading) return;
    loader.isLoading = true;
    let params = (new URL(document.location)).searchParams;
    let startPost = params.get("start");
    try {
        startPost = parseInt(startPost);
    } catch {
        startPost = 0;
    }
    startPost = startPost ? startPost : 0;
    let numPostsOnPage = $(".post").length;
    params.set("start", startPost + numPostsOnPage);
    $.get("https://scioly.org/forums/viewtopic.php?" + params, parseNewPosts);
}

function parseNewPosts(data) {
    let lastCurrentPost = $(".post:last");
    loader.finishedLoading = lastCurrentPost.attr("id") === $(data).find(".post:last").attr("id");
    if (!loader.finishedLoading) {
        let newPosts = $(data).find(".post");
        parseQuotes(newPosts);
        lastCurrentPost.after(newPosts);
        parseHideTags();
        setTimeout(() => {
            loader.isLoading = false;
        }, 10000)
    } else {
        loader.isLoading = false;
    }
}

class Post {
    constructor(htmlPost) {
        this.elem = $(htmlPost);
        this.id = this.elem.attr("id");
        this.author = this.elem.find(".username:first");
        this.content = this.elem.find(".content");
    }
}

let posts = [];

function parseQuotes(newPosts) {
    // start from top
    newPosts.each((key, jpost) => {
        let post = new Post(jpost);
        // check each new quote among all last messages, going backward in time
        post.elem.find("blockquote").each((_key, blockQuote) => {
            for (let i = posts.length - 1; i > 0; i--) {
                if (posts[i].content.text().replace(/\n/g, "").toLowerCase()
                    .includes($(blockQuote).text().replace(/\n/g, "").toLowerCase())) {
                    $(blockQuote)
                        .removeClass("uncited")
                        .addClass("clickable")
                        .attr("author", posts[i].author.text())
                        .on("click", () => {
                            location.href = `#${posts[i].id}`
                        });
                }
            }
        });

        posts.push(post);
    });
}

function parseHideTags() {
    let tags = $("dl.codebox");
    tags.each((key, rawTag) => {
        let tag = $(rawTag);
        tag.find("dt").off("click").on("click", () => {
            tag.find("span[title=hereitis]").toggle();
        }).addClass("clickable");
    })
}

function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}
