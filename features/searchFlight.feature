Feature: Search Flight
    As a user I should be able to search a flight

    Background:
        Given I open Ryanair webpage

    Scenario: Anonymous Search
        Given I search for a flight from "DUB" to "STN" on 12/22/2023 for 2 adults and 1 child
        When I proceed to pay with selected seats and 20kg bags added
        Then login popup shows up
