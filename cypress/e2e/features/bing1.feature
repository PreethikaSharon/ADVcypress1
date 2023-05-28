 Feature: Bing Test Suite
    This feature file will validate the search functionality of Bing Page

    Background: setupblock
        Given User is on Bing home page
 
 @sanity
    Scenario Outline: Search  Validation
        It will validate the search functionality for each set of values defined in examples block

        When user types Search value as "Cypress"
        And Clicks on Search Icon
        Then check Total Count of Results Searched