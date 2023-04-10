function validator(formSelector) {
  var formElement = $(formSelector);
  var formRules = {};
  var validator = {
    required: function (value) {
      return value ? undefined : "必須項目です";
    },
    email: function (value) {
      if (!value) return "必須項目です";
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(value).toLowerCase())
        ? undefined
        : "無効な電子メール";
    },
    number: function (value) {
      if (!value) return "必須項目です";
      var re = /^[0-9]+$/;
      return re.test(String(value))
        ? undefined
        : "このフィールドは数値でなければなりません";
    },
    max: function (max) {
      return function (value) {
        if (!value) return "必須項目です";
        var stringNum = String(value).replaceAll(" ", "");
        return stringNum.length == max
          ? undefined
          : `電話番号は ${max} 桁である必要があります`;
      };
    },
  };

  // Validate when input and blur input element
  if (formElement) {
    var inputs = formElement.find("[name][data-rules]");
    inputs.each(function () {
      var rules = $(this).attr("data-rules").split("|");
      for (var rule of rules) {
        var isHasColon = rule.includes(":");
        var ruleInfo = [];
        if (isHasColon) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }
        var ruleFunc = validator[rule];

        if (isHasColon) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[this.name])) {
          formRules[this.name].push(ruleFunc);
        } else {
          formRules[this.name] = [ruleFunc];
        }
      }
      $(this).on("blur", function (e) {
        handleValidate.call(this, e);
      });
      $(this).on("input", function (e) {
        handleValidate.call(this, e);
      });
    });

    // Validate when submit
    $(formElement).on("submit", function (e) {
      e.preventDefault();
      var inputs = formElement.find("[name][data-rules]");
      var isValidResult = [];
      inputs.each(function () {
        isValidResult.push(handleValidate.call($(this), { target: this }));
      });

      let check = isValidResult.some((valid) => valid === false);

      if (!check) {
        this.reset();
        alert("すぐにご連絡いたします!");
      }
    });

    // Validate function and show error in UI
    function handleValidate(e) {
      var rules = formRules[e.target.name];
      var errorMess = "";
      for (var rule of rules) {
        errorMess = rule(e.target.value);
        if (errorMess) break;
      }
      if (errorMess) {
        $(this).next().text(errorMess);
      } else {
        $(this).next().text("");
      }
      return errorMess ? false : true;
    }
  }
}

$(function () {
  $(".top__slide").slick({
    autoplay: false,
    autoplaySpeed: 3000,
    centerMode: true,
    slidesToShow: 3,
    centerPadding: "240px",
    arrows: true,
    variableWidth: true,
    infinite: true,
    nextArrow: $('.slick-next'),
    prevArrow: $('.slick-prev'),
    appendDots: $('.slick-dots'),
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  validator("#contact__form");

  $("select.contact__dropdown").on("change", function (e) {
    if (e.target.value) {
      $(this).addClass("is-focus");
    } else {
      $(this).removeClass("is-focus");
    }
  });

  // Open close menu mobile
  function disableScroll() {
    var ycoord = $(window).scrollTop();
    $(".c-header__navsp").data("ycoord", ycoord);
    ycoord = ycoord * -1;
    $("body")
      .css("position", "fixed")
      .css("left", "0px")
      .css("right", "0px")
      .css("top", ycoord + "px");
  }
  function enableScroll() {
    $("body")
      .css("position", "")
      .css("left", "auto")
      .css("right", "auto")
      .css("top", "auto");
    $(window).scrollTop($(".c-header__navsp").data("ycoord"));
  }

  $(".c-header__toggle").click(function () {
    $(this).toggleClass("open");
    $(".c-header__navsp").scrollTop(0);
    $(".c-header__navsp").toggleClass("open");

    if ($(this).hasClass("open")) {
      disableScroll();
    } else {
      enableScroll();
    }
  });

  $(".c-header__sublink").click(function (e) {
    $(".c-header__toggle").trigger("click");
  });
  $(".c-header__linksp").click(function (e) {
    $(".c-header__toggle").trigger("click");
  });

  $(window).resize(function () {
    if ($(window).width() > 1024 && $(".c-header__toggle").hasClass("open")) {
      $(".c-header__toggle").trigger("click");
    }
  });

  function setActiveMenu() {
    var currentPathname = "." + window.location.pathname;
    var listMenuItem = $('a[href^="./"]')
    listMenuItem.each(function() {
      var menuHref = $(this).attr('href')
      if((currentPathname.includes(menuHref.replace("./", ""))) && (menuHref !== './index.html')) {
        $(this).parent().addClass('active')
        if(menuHref === './contact.html') {
        $(this).addClass('active')
        }
      }
    })
  }

  setActiveMenu()

});
