/*eslint-disable */
$(function () {
    function loadInMain(url) {
      var $iframe = $('#frame').attr('src', url);
    };

    function getUrl(item) {
      var url = './'
      var splitted = item.split('~');
      if (splitted.length > 1){
        url += splitted[0]+'.html';
        url += '#~'+splitted[1];
      } else {
        splitted = item.split('#');
        if (splitted.length > 1){
          url += splitted[0]+'.html';
          if (splitted.length > 1){
            url += '#'+splitted[1];
          }
        } else {
          splitted = item.split('.');
          url += splitted[0]+'.html';
          if (splitted.length > 1){
            url += '#.'+splitted[1];
          }
        }
      }
      return url;
    }

    function loadItem(item) {
      loadInMain(getUrl(item));
    }

    function setActive(item) {
      $('.item').removeClass('activeView');
      item.addClass('activeView');
    }

    function isActive(item) {
      return item.hasClass('activeView');
    }

    $('#frame').load(function() {
      $('#frame').css('height', ($(window).height()-50)+'px');
      $('#frame').css('width', ($(window).width()-$('.navigation').css('width'))+'px');
    });

    window.onresize = function(event) {
      $('#frame').css('height', ($(window).height()-50)+'px');
      $('#frame').css('width', ($(window).width()-$('.navigation').css('width'))+'px');
    };

    // Search Items
    $('#search').on('keyup', function (e) {
        var value = $(this).val();
        var $el = $('.navigation');

        if (value) {
            var regexp = new RegExp(value, 'i');
            $el.find('li, .itemMembers').hide();

            $el.find('li').each(function (i, v) {
                var $item = $(v);

                if ($item.data('name') && regexp.test($item.data('name'))) {
                    $item.show();
                    $item.closest('.itemMembers').show();
                    $item.closest('.item').show();
                    $item.closest('.category').show();
                }
            });
        } else {
            $el.find('li, .item, .itemMembers').hide();
            $el.find('li, .item').show();
        }

        $el.find('.list').scrollTop(0);
    });

    $('.navigation').on('click', '.item .title a', function (e) {
        var el = $(this).closest('.item');
        var elem = el.find('.itemMembers');
        var wasVisible = elem.is(":visible");
        if (wasVisible && (isActive(el) || !el.hasClass('loadable'))) {
          el.find('.itemMembers').hide();
        } else {
          el.find('.itemMembers').show();
          if (el.hasClass('loadable') && !isActive(el)){
            loadItem(el.data('name'));
            setActive(el);
          } else if (el.hasClass('embedded')) {
            loadItem(el.data('link'));
            setActive(el);
          }
        }
    });

    $('.navigation').on('click', '.subitem a', function (e) {
      var el = $(this).closest('.subitem');
      loadItem(el.data('name'));
      setActive(el.closest('.item'));
      e.stopPropagation();
    });

    // Show an item related a current documentation automatically
    var filename = $('.page-title').data('filename').replace(/\.[a-z]+$/, '');
    var $currentItem = $('.navigation .item[data-name*="' + filename + '"]:eq(0)');

    if ($currentItem.length) {
        $currentItem
            .remove()
            .prependTo('.navigation .list')
            .show()
            .find('.itemMembers')
                .show();
    }

    // Auto resizing on navigation
    var _onResize = function () {
        var height = $(window).height();
        var $el = $('.navigation');

        $el.height(height).find('.list').height(height - 133);
    };

    $(window).on('resize', _onResize);
    _onResize();

    // disqus code
    if (config.disqus) {
        $(window).on('load', function () {
            var disqus_shortname = config.disqus; // required: replace example with your forum shortname
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            var s = document.createElement('script'); s.async = true;
            s.type = 'text/javascript';
            s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
            document.getElementsByTagName('BODY')[0].appendChild(s);
        });
    }


});
/*eslint-enable */
