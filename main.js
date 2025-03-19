$(document).ready(function() {
    const table = $("table");
    const tbody = $("#myTable");
    const rows = tbody.find("tr");
    let rowsPerPage = parseInt($("#rowsPerPage").val());
    let currentPage = 1;
  
    // Initial table setup
    showPage(currentPage);
  
    $("#myInput").on("keyup", function() {
      const value = $(this).val().toLowerCase();
      rows.each(function() {
        const rowText = $(this).text().toLowerCase();
        $(this).toggle(rowText.indexOf(value) > -1);
      });
      showPage(1); // Reset to first page after filtering
    });
  
    let sortDirections = {};
  
    $("th").on("click", function() {
      const column = $(this).data("column");
      const th = $(this);
  
      // Reset all other th classes
      $("th").not(this).removeClass("asc desc");
  
      // Initialize sort direction if not already set
      if (sortDirections[column] === undefined) {
        sortDirections[column] = 1; // Ascending
        th.addClass("asc").removeClass("desc");
      } else {
        sortDirections[column] = -sortDirections[column]; // Toggle direction
        th.toggleClass("asc desc");
      }
  
      rows.sort(comparer(column, sortDirections[column]));
      tbody.empty().append(rows);
      showPage(1); // Reset to first page after sorting
    });
  
    function comparer(column, sortDirection) {
      return function(a, b) {
        const valA = $(a).find("td:nth-child(" + ($("th[data-column='" + column + "']").index() + 1) + ")").text();
        const valB = $(b).find("td:nth-child(" + ($("th[data-column='" + column + "']").index() + 1) + ")").text();
  
        let comparison = 0;
        if ($.isNumeric(valA) && $.isNumeric(valB)) {
          comparison = valA - valB;
        } else {
          comparison = valA.localeCompare(valB);
        }
  
        return sortDirection * comparison;
      };
    }
  
    $("#nextPage").on("click", function() {
      if (currentPage < numberOfPages()) {
        currentPage++;
        showPage(currentPage);
      }
    });
  
    $("#prevPage").on("click", function() {
      if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
      }
    });
  
    $("#rowsPerPage").on("change", function() {
      rowsPerPage = parseInt($(this).val());
      showPage(1); // Reset to first page after changing rows per page
    });
  
    function showPage(page) {
      tbody.empty();
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
  
      let filteredRows = rows.filter(function() {
        return $(this).css("display") !== "none";
      });
  
      for (let i = startIndex; i < endIndex && i < filteredRows.length; i++) {
        tbody.append(filteredRows[i]);
      }
    }
  
    function numberOfPages() {
      let filteredRows = rows.filter(function() {
        return $(this).css("display") !== "none";
      });
      return Math.ceil(filteredRows.length / rowsPerPage);
    }
  });
  