# e-Spaza Project

## Table of Contents
1. [Introduction](#introduction)
2. [Project Objectives](#project-objectives)
3. [Features](#features)
4. [System Requirements](#system-requirements)
5. [Installation and Setup](#installation-and-setup)
6. [Usage](#usage)
7. [Project Architecture](#project-architecture)
8. [Testing](#testing)
9. [Continuous Integration/Continuous Deployment (CI/CD)](#continuous-integrationcontinuous-deployment-cicd)
10. [Scrum Methodology](#scrum-methodology)
11. [Acknowledgements](#acknowledgements)
12. [Required passwords](#required-passwords)

## Introduction
The e-Spaza project is designed to equip spaza shop owners with an efficient stock management system and provide customers with a convenient way to order items from multiple shops. This README provides an overview of the project, installation instructions, usage guidelines, and other relevant information for assessment purposes.

## Project Objectives
- Equip spaza shop owners with tools to manage their stock efficiently.
- Enable customers to order items from multiple shops.
- Equip spaza shop owners with tools to manage staff and customers.
- Generate various reports for shop owners.

## Features
- **User Verification**: Supports three roles - Shopper, Staff, and Admin.
- **User Management**: Admins can manage users by onboarding staff, removing access, and changing permissions. Admins can also manage customers similarly.
- **Shopping**: Customers can view items, search, add items to their cart, view information about items and track order status.
- **Order & Stock Management**: Shop staff can fulfill orders (i.e. mark an order as: Pending, Shipped, Delivered or Cancelled) and manage inventory. Inventory will automatically decrease when a customer purchases an item, staff members can also add new items manually as they are purchased. 
- **Reporting**: Generate and export reports on stock on hand, order history, and stock that is running low.

## System Requirements
- **Software**: LiveServer, Node.js, npm, Git.

## Installation and Setup
1. **Clone the Repository**
    ```bash
    git clone https://github.com/SpazaHub/SpazaHub
    ```

2. **Install Required Dependencies**
    ```bash
    npm install
    ```

3. **Run the Application**
   Go live using LiveServer.


## Usage
- **Admin Panel**: Manage staff members and customers.
- **Staff Panel**: Add new product, stock management and order management.
- **Customer Portal**: Browse shops, add items to cart, place orders and view status of orders.
- **Reports**: View and export various reports.

## Project Architecture
- **Frontend**:Built with HTML, CSS, and JavaScript.
- **Backend**: Node.js with Firebase for database and authentication.
- **Database**: Firebase.
- **Authentication**: Firebase Authentication.
- **CI/CD**: GitHub Actions.

## Testing
- **Unit Tests**: Written using Jest.
    ```bash
    npm test
    ```

## Continuous Integration/Continuous Deployment (CI/CD)
- Configured using GitHub Actions.
- Ensure that all commits are made to the GitHub repository and that the CI pipeline passes.

## Scrum Methodology
We followed the Scrum methodology throughout the project, ensuring regular sprint planning, daily stand-ups, sprint reviews, and retrospectives. Meeting minutes and evidence of our Scrum activities are documented in the project repository.

## Acknowledgements
- Group members:
  Devesh Chiba - 2537948
  Ariyasha Manilall - 2446895
  Shayur Govin - 2558583
  Justin Gangan - 2461953
  Sayj Ramsamy - 2551879
  Andre Canga - 2557226

## Required Passwords
-To access admin page: admin123
Admin login:
email:tammy@espazaadmin.co.za
password:Tammy7
-To access staff page: staff123
Staff login:
email:trent@espazaadmin.co.za
password:Trent7
-To access Jira:
email:softwaredesigniscool@gmail.com
password:Luckyiscool123!@#
