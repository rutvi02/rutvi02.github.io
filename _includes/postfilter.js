document.addEventListener("DOMContentLoaded", function() {
  
  (function() {
    
    // --- 1. Selectors and Data Gathering ---
    // CHANGED: Selectors for blog elements and data attribute
    var blogElems = document.querySelectorAll(".blog-post");
    var yearElems = document.querySelectorAll(".year");

    var clearElem = document.getElementById("clear-filters");
    // Removed: highlightElem (Since we removed the highlight feature)

    var data = [];
    var allYears = new Set();

    blogElems.forEach(function(element) {
      var item;
      try {
          // 1. Safely parse the data string into a JS object
          item = JSON.parse(element.getAttribute("data-post")); 
      } catch (e) {
          console.error("Error parsing JSON data for post:", element, e);
          return; // Skip this element if parsing failed
      }
      
      // Get the year from the post date string (e.g., "2024-01-15 00:00:00 -0500" -> "2024")
      if (item.date) {
        allYears.add(item.date.substring(0, 4));
      }

      item.element = element;

      // 2. CRITICAL FIX: Robustly ensure 'tags' property is an array for ItemsJS
      if (item.tags) {
          if (typeof item.tags === 'string') {
              // Handle comma-separated string tags if that's how it's being serialized
              item.tags = item.tags.split(/,\s*/).map(t => t.trim()).filter(t => t.length > 0);
          } else if (!Array.isArray(item.tags)) {
              // If it's a single item (not string, not array), force it into an array
              item.tags = [item.tags];
          }
      } else {
          // If the post has no tags property, initialize it as an empty array
          item.tags = [];
      }
      
      data.push(item);
    });

    // --- 2. ItemsJS Configuration ---
    var engine = itemsjs(data, {
      aggregations: {
        // ONLY using tags, matching your blog structure
        tags: {
          size: 10
        }
      },
      // Searching title and tags, as requested
      searchableFields: ["tags", "title"]
      // Removed: authors, awards, etc.
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
    }, {});

    var query = { filters: result };

    // --- 4. setAggs Function (Renders Filters) ---
    function setAggs(aggs) {
      // Since we only have one facet (#tags), this loop still works.
      document.querySelectorAll("#facets > .facet").forEach(function(facet) {
        var id = facet.getAttribute("id");

        // Skip if the aggregation ID doesn't exist (e.g., if a facet HTML exists but isn't configured in ItemsJS)
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
    var ftSearch = document.getElementById("ft-search");
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

      // CHANGED: Use blogElems for count and iteration
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

      // show or hide notification about filtered papers
      if (Object.keys(query.filters).length || query.query) {
        clearElem.classList.remove("hidden");
      } else {
        clearElem.classList.add("hidden");
      }
      
      // Removed highlight checkbox logic

      console.timeEnd("Search");
    }

    // Removed highlightElem.onchange function

    // --- 7. Clear Filters Handler ---
    clearElem.onclick = function() {
      query = { filters: {} };
      ftSearch.value = "";
      search(query);
    };

    // Initial search and setup
    search(query);

    document.getElementById("facets").classList.remove("hidden");
    // Removed: document.getElementById("only-highlight").classList.remove("hidden");
  })();
});