var billing = angular.module('billingProcess', []);

billing.controller('billCtrl', function($scope, $interval) {
    $scope.currentDate = new Date();

    $interval(function() {
        $scope.currentTime = new Date();
    }, 1000);

    $scope.items = [
        { itemName: "Egg", MRP: 6.0, Rate: 5.50 },
        { itemName: "Carrot", MRP: 55.0, Rate: 50.0 },
        { itemName: "Spinach", MRP: 10.0, Rate: 8.0 },
        { itemName: "Lady's Finger", MRP: 60.0, Rate: 55.0 },
        { itemName: "Beetroot", MRP: 45.0, Rate: 40.0 },
        { itemName: "Beans", MRP: 65.0, Rate: 60.0 },
        { itemName: "Cauliflower", MRP: 25.0, Rate: 20.0 },
        { itemName: "Mushroom", MRP: 45.0, Rate: 40.0 },
        { itemName: "Brinjal", MRP: 40.0, Rate: 35.0 },
        { itemName: "Tomato", MRP: 35.0, Rate: 30.0 },
        { itemName: "Onion (Small)", MRP: 55.0, Rate: 50.0 },
        { itemName: "Onion (Big)", MRP: 45.0, Rate: 40.0 },
        { itemName: "Potato", MRP: 30.0, Rate: 25.0 },
        { itemName: "Coconut", MRP: 25.0, Rate: 20.0 }
    ];

    $scope.billedItems = [];
    $scope.customerName = "";  
    $scope.amtReceived = 0;    
    $scope.balanceAmt = 0;

    $scope.newItem = {
        sno:1,
        itemName: '',
        quantity: 1.0,
        MRP: 0.0,
        Rate: 0.0
    };

    $scope.$watch('newItem.itemName', function(newVal) {
        let item = $scope.items.find(item => item.itemName === newVal);
        if (item) {
            $scope.newItem.MRP = item.MRP;
            $scope.newItem.Rate = item.Rate;

        } else {
            $scope.newItem.MRP = 0.0;
            $scope.newItem.Rate = 0.0;
        }
    });

    $scope.addItem = function() {
        if ($scope.newItem.itemName && $scope.newItem.quantity > 0) {
            let index = $scope.items.findIndex(item => item.itemName === $scope.newItem.itemName);
            if (index !== -1) {
                let snoin = $scope.billedItems.length + 1;
                $scope.billedItems.push({
                    sno: snoin,
                    itemName: $scope.newItem.itemName,
                    MRP: parseFloat($scope.newItem.MRP),
                    Rate: parseFloat($scope.newItem.Rate),
                    quantity: parseFloat($scope.newItem.quantity)
                });

                $scope.totalAmount = $scope.calculateTotal();
                $scope.updateBalance();
                $scope.newItem = {sno: snoin + 1, itemName: '', quantity: 1.0, MRP: 0.0, Rate: 0.0 };
                document.getElementById('itemNameInput').focus();
            } else {
                alert("Item not found or invalid input");
            }
        }
    };
    

    $scope.removeItem = function(index) {
        $scope.billedItems.splice(index, 1);
        $scope.billedItems.forEach((item, idx) => {
            item.sno = idx + 1;
        });
        $scope.newItem.sno = $scope.billedItems.length + 1;
        $scope.totalAmount = $scope.calculateTotal();
        $scope.updateBalance();
    };
    

    $scope.calculateTotal = function() {
        return $scope.billedItems.reduce(function(total, item) {
            return total + (item.Rate * item.quantity);
        }, 0);
    };

    $scope.updateBalance = function() {
        $scope.balanceAmt = $scope.amtReceived - $scope.totalAmount || 0;
    };

    $scope.$watch('amtReceived', function() {
        $scope.updateBalance();
    });
    
    $scope.filteredItems = [];
    $scope.selectedIndex = -1;

    $scope.filterItems = function() {
        var query = $scope.newItem.itemName.toLowerCase();
        $scope.filteredItems = $scope.items.filter(function(item) {
            return item.itemName.toLowerCase().includes(query);
        });
        if ($scope.filteredItems.length > 0) {
            $scope.selectedIndex = 0;
        } else {
            $scope.selectedIndex = -1;
        }
    };

    $scope.selectItem = function(item) {
        $scope.newItem.itemName = item.itemName;
        $scope.filteredItems = [];
        $scope.selectedIndex = -1;
    };

    $scope.handleKeydown = function(event) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            $scope.selectedIndex = ($scope.selectedIndex + 1) % $scope.filteredItems.length;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            $scope.selectedIndex = ($scope.selectedIndex - 1 + $scope.filteredItems.length) % $scope.filteredItems.length;
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if ($scope.selectedIndex > -1 && $scope.selectedIndex < $scope.filteredItems.length) {
                $scope.selectItem($scope.filteredItems[$scope.selectedIndex]);
            }
        } else if (event.key === 'Escape') {
            $scope.filteredItems = [];
            $scope.selectedIndex = -1;
        }
    };

    console.log(localStorage.getItem('billedItems'));

    $scope.print = function() {
        var amtReceived = parseFloat($scope.amtReceived);
        var totalAmount = parseFloat($scope.totalAmount);
        var balanceAmount = parseFloat($scope.balanceAmt);
    
        if (isNaN(amtReceived) || isNaN(totalAmount) || isNaN(balanceAmount)) {
            alert("One or more values are not valid numbers.");
            return;
        }
    
        localStorage.setItem('customerName', JSON.stringify($scope.customerName));
        localStorage.setItem('billedItems', JSON.stringify($scope.billedItems));
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));
        localStorage.setItem('amountReceived', amtReceived.toFixed(2));
        localStorage.setItem('balanceAmount', balanceAmount.toFixed(2));
    
        window.location.href = 'billItem.html';

        console.log("amtReceived:", $scope.amtReceived, "Type:", typeof $scope.amtReceived);

    };
    
    

});