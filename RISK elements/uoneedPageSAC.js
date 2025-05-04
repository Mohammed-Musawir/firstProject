
 // Toggle sidebar on mobile
document.querySelector('.toggle-sidebar')?.addEventListener('click', function() {
    document.querySelector('.dashboard-sidebar').classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const toggleBtn = document.querySelector('.toggle-sidebar');
    
    if (window.innerWidth <= 992 && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(event.target) && 
        event.target !== toggleBtn) {
        sidebar.classList.remove('active');
    }
});

// For dynamic tracking updates
const updateOrderStatus = function(newStatus, newTimeline) {
    // This function would be called via AJAX to update order status in real-time
    // For implementation purposes, you'd connect this to your backend
    console.log("Status updated to: " + newStatus);
    // You would then update the UI based on the new data
};

// Invoice download with fetch
document.getElementById('downloadInvoiceBtn').addEventListener('click', function() {
    const orderNumber = '<%= order.orderId %>';
    
    fetch(`/account/orders/${orderNumber}/invoice`, {
        method: 'GET',
        headers: {
            'Accept': 'application/pdf'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `invoice-${orderNumber}.pdf`;
        
        // Append to the document and click
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
    .catch(error => {
        console.error('Error downloading invoice:', error);
        alert('Failed to download invoice. Please try again later.');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Return button functionality
    const returnOrderBtn = document.getElementById('returnOrderBtn');
    if (returnOrderBtn) {
        returnOrderBtn.addEventListener('click', function() {
            const returnModal = new bootstrap.Modal(document.getElementById('returnConfirmModal'));
            returnModal.show();
        });
    }
    
    // Cancel button functionality
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', function() {
            const cancelModal = new bootstrap.Modal(document.getElementById('cancelConfirmModal'));
            cancelModal.show();
        });
    }
    
    // Handle "Other" reason selection for return
    const returnReason = document.getElementById('returnReason');
    const otherReasonContainer = document.getElementById('otherReasonContainer');
    
    if (returnReason) {
        returnReason.addEventListener('change', function() {
            if (this.value === 'other') {
                otherReasonContainer.style.display = 'block';
            } else {
                otherReasonContainer.style.display = 'none';
            }
        });
    }
    
    // Handle "Other" reason selection for cancel
    const cancelReason = document.getElementById('cancelReason');
    const otherCancelReasonContainer = document.getElementById('otherCancelReasonContainer');
    
    if (cancelReason) {
        cancelReason.addEventListener('change', function() {
            if (this.value === 'other') {
                otherCancelReasonContainer.style.display = 'block';
            } else {
                otherCancelReasonContainer.style.display = 'none';
            }
        });
    }
    
    // Confirm return action
    const confirmReturnBtn = document.getElementById('confirmReturnBtn');
    if (confirmReturnBtn) {
        confirmReturnBtn.addEventListener('click', function() {
            const reason = document.getElementById('returnReason').value;
            let otherReason = '';
            
            if (reason === 'other') {
                otherReason = document.getElementById('otherReason').value;
                if (!otherReason.trim()) {
                    alert('Please specify your return reason');
                    return;
                }
            }
            
            if (!reason) {
                alert('Please select a return reason');
                return;
            }
            
            // Submit return request
            const orderNumber = '<%= order.orderId %>';
            submitReturnRequest(orderNumber, reason, otherReason);
        });
    }
    
    // Confirm cancel action
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', function() {
            const reason = document.getElementById('cancelReason').value;
            let otherReason = '';
            
            if (reason === 'other') {
                otherReason = document.getElementById('otherCancelReason').value;
                if (!otherReason.trim()) {
                    alert('Please specify your cancellation reason');
                    return;
                }
            }
            
            if (!reason) {
                alert('Please select a cancellation reason');
                return;
            }
            
            // Submit cancellation request
            const orderNumber = '<%= order.orderId %>';
            submitCancelRequest(orderNumber, reason, otherReason);
        });
    }
    
    // Function to submit return request
    function submitReturnRequest(orderNumber, reason, otherReason) {
        fetch(`/orders/${orderNumber}/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reason: reason,
                otherReason: otherReason
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Return request submitted successfully');
                location.reload();
            } else {
                alert(data.message || 'Failed to submit return request');
            }
        })
        .catch(error => {
            console.error('Error submitting return request:', error);
            alert('An error occurred. Please try again later.');
        });
    }
    
    // Function to submit cancel request
    function submitCancelRequest(orderNumber, reason, otherReason) {

        fetch(`/orders/${orderNumber}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reason: reason,
                otherReason: otherReason
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Order cancelled successfully');
                location.reload();
            } else {
                alert(data.message || 'Failed to cancel order');
            }
        })
        .catch(error => {
            console.error('Error cancelling order:', error);
            alert('An error occurred. Please try again later.');
        });
    }
});
