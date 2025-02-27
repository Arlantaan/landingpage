<script>
    document.getElementById("contactForm").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent form from reloading

        const formData = new FormData(this);

        try {
            const response = await fetch(this.action, {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            });

            if (response.ok) {
                alert("Thank you! Your request has been submitted.");
                this.reset(); // Clear form fields
            } else {
                const errorData = await response.json();
                console.error("Form submission error:", errorData);
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Error submitting form. Please check your connection.");
        }
    });
</script>
