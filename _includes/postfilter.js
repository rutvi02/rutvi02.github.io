(function() {
  // 1. Selectors and Data Gathering
  var blogElems = document.querySelectorAll(".blog-post"); 
  var yearElems = document.querySelectorAll(".year");

  var clearElem = document.getElementById("clear-filters");
  var ftSearch = document.getElementById("ft-search");

  var data = [];
  var allYears = new Set();

  blogElems.forEach(function(element) {
    // CHANGED: Reading from the data-post attribute
    var item = JSON.parse(element.getAttribute("data-post")); 

    allYears.add(item.date.substring(0, 4)); 

    item.element = element;
    
    // Ensure tags is treated as an array for ItemsJS
    item.tags = Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []);
    
    // Set categories to an empty array so it doesn't cause errors if searched
    item.categories = []; 
    
    data.push(item);
  });

  // 2. ItemsJS Configuration
  var engine = itemsjs(data, {
    aggregations: {
      // ONLY using tags, matching your post structure and blog.md HTML
      tags: { 
        size: 10 
      }
    },
    // Searchable fields
    searchableFields: ["tags", "title", "content", "description"] 
  });

  // 3. Filtering and Search Logic (Remaining code for setAggs, search, etc.)
  
  var hash = decodeURIComponent(window.location.hash.substr(1));

  var result = hash.split('&').reduce(function (res, item) {
      var [key, value] = item.split('=');
      if (key && value) {
        if (key in res) {
          res[key].push(value)
        } else {
          res[key] = [value];
        }
      }
      return res;
  }, {});

  var query = { filters: result };

  function setAggs(aggs) {
    document.querySelectorAll("#facets > .facet").forEach(function(facet) {
      var id = facet.getAttribute("id");
      
      if (!aggs[id]) return; 

      var buckets = aggs[id].buckets;

      var el = facet.querySelector("ul");
      if (buckets.length === 0) {
        el.innerHTML = "Empty";
      } else {
        el.innerHTML = "";

        buckets.forEach(function(bucket) {
          if (query.filters[id] && query.filters[id].indexOf(bucket.key) >= 0) {
            bucket.in_query = true;
          }
        });

        var maxDocCount = Math.max.apply(
          null,
          buckets.map(function(bucket) {
            return bucket.doc_count;
          })
        );

        buckets.forEach(function(bucket) {
          var child = document.createElement("li");

          var wrap = document.createElement("span");
          child.appendChild(wrap);

          var text = document.createElement("span");
          text.classList.add("limited");
          text.innerText = bucket.key;
          text.setAttribute("title", bucket.key);
          var number = document.createElement("span");
          number.classList.add("cnt");
          number.innerText = " (" + bucket.doc_count + ")";
          wrap.appendChild(text);
          wrap.appendChild(number);

          var barFull = document.createElement("div");
          barFull.classList.add("bar-full");
          child.append(barFull);

          var bar = document.createElement("div");
          bar.classList.add("bar");
          bar.style.width = "" + (bucket.doc_count / maxDocCount) * 100 + "%";
          barFull.append(bar);

          if (bucket.in_query) {
            child.classList.add("in-query");

            child.onclick = function() {
              query.filters[id].splice(
                query.filters[id].indexOf(bucket.key),
                1
              );
              if (query.filters[id].length === 0) {
                delete query.filters[id];
              }
              search(query);
            };
          } else {
            child.onclick = function() {
              if (query.filters[id]) {
                query.filters[id].push(bucket.key);
              } else {
                query.filters[id] = [bucket.key];
              }
              search(query);
            };
          }

          el.appendChild(child);
        });
      }
    });
  }

  ftSearch.oninput = function() {
    var val = ftSearch.value;

    if (val) {
      query.query = val;
    } else {
      delete query.query;
    }

    search(query);
  }

  function search(query) {
    console.time("Search");

    var result = engine.search(Object.assign({ per_page: data.length }, query));

    setAggs(result.data.aggregations);

    var counter = blogElems.length - result.data.items.length;

    document.getElementById("count_hidden").innerText = counter;
    document.getElementById("count_total").innerText = blogElems.length;

    blogElems.forEach(function(element) { 
      element.classList.add("hidden");
    });

    var visibleYears = {};
    result.data.items.forEach(function(item) {
      item.element.classList.remove("hidden");
      visibleYears[item.date.substring(0, 4)] = 1;
    });

    yearElems.forEach(function(element) {
      element.classList.add("hidden");
    });
    allYears.forEach(function(year) {
      if (year in visibleYears) {
        document.getElementById("y" + year).classList.remove("hidden");
      }
    });

    if (Object.keys(query.filters).length || query.query) {
      clearElem.classList.remove("hidden");
    } else {
      clearElem.classList.add("hidden");
    }

    console.timeEnd("Search");
  }
  
  clearElem.onclick = function() {
    query = { filters: {} };
    ftSearch.value = "";
    search(query);
  };

  search(query);

  document.getElementById("facets").classList.remove("hidden");
})();