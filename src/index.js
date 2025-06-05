// jQuery Index.js - Complete Implementation
$(document).ready(function() {
    
    // ==============================================
    // DOM MANIPULATION UTILITIES
    // ==============================================
    
    // Element selection examples
    const mainElement = $('#main-content');
    const headerElements = $('.header');
    const allButtons = $('button');
    
    // Event handling setup
    function setupEventHandlers() {
        // Click handlers
        $('#submit-btn').on('click', function(e) {
            e.preventDefault();
            handleSubmit();
        });
        
        // Form submission
        $('#main-form').on('submit', function(e) {
            e.preventDefault();
            processForm($(this));
        });
        
        // Dynamic content handlers
        $(document).on('click', '.dynamic-button', function() {
            handleDynamicClick($(this));
        });
        
        // Hover effects
        $('.hover-element').on('mouseenter', function() {
            $(this).addClass('hovered');
        }).on('mouseleave', function() {
            $(this).removeClass('hovered');
        });
    }
    
    // Content manipulation functions
    function updateContent() {
        // Update HTML content
        $('#content-area').html('<p>New content loaded</p>');
        
        // Update text content
        $('.status-text').text('Status: Active');
        
        // Show/hide elements
        $('#loading-spinner').hide();
        $('#main-content').show();
        
        // Append new elements
        $('.container').append('<div class="new-item">New Item</div>');
        
        // Insert before/after
        $('#target-element').before('<div class="before-element">Before</div>');
        $('#target-element').after('<div class="after-element">After</div>');
    }
    
    // Class manipulation utilities
    function toggleClasses() {
        // Add classes
        $('.inactive').addClass('active');
        
        // Remove classes
        $('.old-style').removeClass('deprecated');
        
        // Toggle classes
        $('.toggle-button').addClass('pressed');
        
        // Check if class exists
        if ($('#special-element').hasClass('highlight')) {
            console.log('Element is highlighted');
        }
    }
    
    // Attribute manipulation
    function handleAttributes() {
        // Get attributes
        const dataValue = $('#data-element').attr('data-value');
        const srcValue = $('#image-element').attr('src');
        
        // Set attributes
        $('#link-element').attr('href', 'https://example.com');
        $('#input-element').attr('placeholder', 'Enter your text...');
        
        // Remove attributes
        $('#temp-element').removeAttr('data-temp');
        
        // Data attributes (jQuery way)
        $('#data-element').data('userId', 12345);
        const userId = $('#data-element').data('userId');
    }
    
    // ==============================================
    // AJAX UTILITIES
    // ==============================================
    
    // Generic AJAX function
    function makeAjaxRequest(url, method = 'GET', data = null) {
        return $.ajax({
            url: url,
            method: method,
            data: data ? JSON.stringify(data) : null,
            contentType: 'application/json',
            dataType: 'json',
            beforeSend: function() {
                $('#loading-indicator').show();
            },
            complete: function() {
                $('#loading-indicator').hide();
            }
        });
    }
    
    // POST request example
    function submitData(formData) {
        makeAjaxRequest('/api/submit', 'POST', formData)
            .done(function(response) {
                $('#success-message').text('Data submitted successfully!').show();
                console.log('Success:', response);
            })
            .fail(function(xhr, status, error) {
                $('#error-message').text('Error: ' + error).show();
                console.error('Error:', error);
            });
    }
    
    // GET request example
    function loadData() {
        makeAjaxRequest('/api/data')
            .done(function(data) {
                populateTable(data);
            })
            .fail(function(xhr, status, error) {
                console.error('Failed to load data:', error);
            });
    }
    
    // ==============================================
    // AUTOCOMPLETE IMPLEMENTATION
    // ==============================================
    
    // Initialize autocomplete
    function initializeAutocomplete() {
        $('#search-input').autocomplete({
            hint: false,
            debug: false,
            minLength: 2
        }, [
            {
                source: function(query, callback) {
                    // Debounce the search to avoid too many requests
                    clearTimeout(window.searchTimeout);
                    window.searchTimeout = setTimeout(function() {
                        performSearch(query, callback);
                    }, 300);
                },
                templates: {
                    suggestion: function(suggestion) {
                        return '<div class="autocomplete-suggestion">' +
                               '<div class="suggestion-title">' + escapeHtml(suggestion.name) + '</div>' +
                               '<div class="suggestion-description">' + escapeHtml(suggestion.description || '') + '</div>' +
                               '</div>';
                    },
                    empty: function() {
                        return '<div class="autocomplete-empty">No results found</div>';
                    }
                },
                displayKey: 'name'
            }
        ]);
        
        // Handle selection
        $('#search-input').on('autocomplete:selected', function(event, suggestion) {
            handleSearchSelection(suggestion);
        });
        
        // Handle manual search
        $('#search-form').on('submit', function(e) {
            e.preventDefault();
            const query = $('#search-input').val();
            if (query.trim()) {
                performManualSearch(query);
            }
        });
    }
    
    // Perform search via AJAX
    function performSearch(query, callback) {
        $.ajax({
            url: '/api/search',
            method: 'GET',
            data: { 
                q: query,
                limit: 10 
            },
            dataType: 'json'
        })
        .done(function(response) {
            // Assuming response has a 'results' array
            callback(response.results || []);
        })
        .fail(function(xhr, status, error) {
            console.error('Search failed:', error);
            callback([]);
        });
    }
    
    // Handle search selection
    function handleSearchSelection(suggestion) {
        console.log('Selected:', suggestion);
        
        // Update UI based on selection
        $('#selected-item').html(
            '<h3>' + escapeHtml(suggestion.name) + '</h3>' +
            '<p>' + escapeHtml(suggestion.description || '') + '</p>'
        );
        
        // Trigger additional actions
        if (suggestion.id) {
            loadItemDetails(suggestion.id);
        }
    }
    
    // Manual search when form is submitted
    function performManualSearch(query) {
        makeAjaxRequest('/api/search', 'GET', { q: query })
            .done(function(response) {
                displaySearchResults(response.results || []);
            })
            .fail(function(xhr, status, error) {
                $('#search-results').html('<div class="error">Search failed: ' + error + '</div>');
            });
    }
    
    // ==============================================
    // UTILITY FUNCTIONS
    // ==============================================
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = $('<div>');
        return div.text(text).html();
    }
    
    // Display search results
    function displaySearchResults(results) {
        const resultsContainer = $('#search-results');
        resultsContainer.empty();
        
        if (results.length === 0) {
            resultsContainer.html('<div class="no-results">No results found</div>');
            return;
        }
        
        results.forEach(function(result) {
            const resultElement = $('<div class="search-result-item">')
                .html(
                    '<h4>' + escapeHtml(result.name) + '</h4>' +
                    '<p>' + escapeHtml(result.description || '') + '</p>'
                )
                .data('result-id', result.id)
                .on('click', function() {
                    handleSearchSelection(result);
                });
            
            resultsContainer.append(resultElement);
        });
    }
    
    // Load item details
    function loadItemDetails(itemId) {
        makeAjaxRequest('/api/items/' + itemId)
            .done(function(item) {
                $('#item-details').html(
                    '<h2>' + escapeHtml(item.name) + '</h2>' +
                    '<div class="item-content">' + escapeHtml(item.content || '') + '</div>'
                );
            })
            .fail(function(xhr, status, error) {
                $('#item-details').html('<div class="error">Failed to load item details</div>');
            });
    }
    
    // Form processing
    function processForm($form) {
        const formData = {};
        
        // Serialize form data
        $form.find('input, select, textarea').each(function() {
            const $field = $(this);
            const name = $field.attr('name');
            const value = $field.val();
            
            if (name && value) {
                formData[name] = value;
            }
        });
        
        submitData(formData);
    }
    
    // Handle submit button
    function handleSubmit() {
        const $form = $('#main-form');
        if ($form.length) {
            processForm($form);
        }
    }
    
    // Handle dynamic button clicks
    function handleDynamicClick($button) {
        const action = $button.data('action');
        
        switch (action) {
            case 'delete':
                if (confirm('Are you sure you want to delete this item?')) {
                    $button.closest('.item').remove();
                }
                break;
            case 'edit':
                // Toggle edit mode
                $button.closest('.item').toggleClass('edit-mode');
                break;
            default:
                console.log('Unknown action:', action);
        }
    }
    
    // Populate table with data
    function populateTable(data) {
        const $tableBody = $('#data-table tbody');
        $tableBody.empty();
        
        data.forEach(function(row) {
            const $row = $('<tr>');
            Object.values(row).forEach(function(cellValue) {
                $row.append('<td>' + escapeHtml(String(cellValue)) + '</td>');
            });
            $tableBody.append($row);
        });
    }
    
    // ==============================================
    // INITIALIZATION
    // ==============================================
    
    // Initialize all components
    function init() {
        setupEventHandlers();
        initializeAutocomplete();
        
        // Load initial data if needed
        if ($('#data-table').length) {
            loadData();
        }
        
        // Update initial content
        updateContent();
        
        console.log('jQuery application initialized');
    }
    
    // Start the application
    init();
    
    // ==============================================
    // EXPORT FUNCTIONS FOR EXTERNAL USE
    // ==============================================
    
    // Make functions available globally if needed
    window.AppUtils = {
        makeAjaxRequest: makeAjaxRequest,
        escapeHtml: escapeHtml,
        updateContent: updateContent,
        toggleClasses: toggleClasses
    };
    
});