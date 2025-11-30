document.addEventListener("DOMContentLoaded", function() {

  (function() {

    // --- 1. Selectors and Data Gathering ---
    var blogElems = document.querySelectorAll(".blog-item");

    // The following variables were removed from the initial block list, but their definitions were not.
    // They are not needed for tag filtering/search.
    // var yearElems; 
    // var allYears; 

    var clearElem = document.getElementById("clear-filters");
    var ftSearch = document.getElementById("ft-search");

    var data = [];

    blogElems.forEach(function(element) {
      var item;
      try {
          // Reading from the data-post attribute
          item = JSON.parse(element.getAttribute("data-post"));
      } catch (e) {
          console.error("Error parsing JSON data for post:", element, e);
          return; // Skip this element if parsing failed
      }

      item.element = element;

      // CRITICAL FIX: Robustly ensure 'tags' property is an array for ItemsJS
      if (item.tags) {
          if (typeof item.tags === 'string') {
              item.tags = item.tags.split(/,\s*/).map(t => t.trim()).filter(t => t.length > 0);
          } else if (!Array.isArray(item.tags)) {
              item.tags = [item.tags];
          }
      } else {
          item.tags = [];
      }

      data.push(item);
    });

    // --- 2. ItemsJS Configuration ---
    var engine = itemsjs(data, {
      aggregations: {
        // ONLY using tags
        tags: {
          size: 10
        }
      },
      // Searching title and tags only
      searchableFields: ["tags"]
    });

    // --- 3. URL Hash & Initial Query ---
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
        }
    , {});

    var query = { filters: result };

    // --- 4. setAggs Function (Renders Filters) ---
    function setAggs(aggs) {
      document.querySelectorAll("#facets > .facet").forEach(function(facet) {
        var id = facet.getAttribute("id");

        // The only expected facet ID is 'tags'
        if (id !== 'tags') return;

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

              // remove filter
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
              // add to filter
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

    // --- 5. Search Input Handler ---
    ftSearch.oninput = function() {
      var val = ftSearch.value;

      if (val) {
        query.query = val;
      } else {
        delete query.query;
      }

      search(query);
    }

    // --- 6. Main Search Function ---
    function search(query) {
      console.time("Search");

      var result = engine.search(Object.assign({ per_page: data.length }, query));

      setAggs(result.data.aggregations);

      var counter = blogElems.length - result.data.items.length;

      document.getElementById("count_hidden").innerText = counter;
      document.getElementById("count_total").innerText = blogElems.length;

      // Hide all posts
      blogElems.forEach(function(element) {
        element.classList.add("hidden");
      });

      // Show only matching posts
      result.data.items.forEach(function(item) {
        item.element.classList.remove("hidden");
      });

      // show or hide notification about filtered posts
      if (Object.keys(query.filters).length || query.query) {
        clearElem.classList.remove("hidden");
      } else {
        clearElem.classList.add("hidden");
      }

      console.timeEnd("Search");
    }

    // --- 7. Clear Filters Handler ---
    clearElem.onclick = function() {
      query = { filters: {} };
      ftSearch.value = "";
      search(query);
    };

    // Initial search and setup
    search(query);

    document.getElementById("facets").classList.remove("hidden");
  })();
});