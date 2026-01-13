(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('ai-course-form');
        const loader = document.getElementById('loading-indicator');
        const output = document.getElementById('course-output');
        const jsonBox = document.getElementById('course-json');
        const errorBox = document.getElementById('error-message');

        if (!form) {
            return;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            loader.classList.remove('hidden');
            output.classList.add('hidden');
            errorBox.classList.add('hidden');

            const formData = new FormData(form);

            fetch('/generate_course', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json().then(function (data) {
                        if (!response.ok || data.result !== 'success') {
                            throw new Error(data.message || 'Generation failed');
                        }
                        return data;
                    });
                })
                .then(function (data) {
                    jsonBox.textContent = JSON.stringify(data.json, null, 2);
                    output.classList.remove('hidden');
                })
                .catch(function (error) {
                    errorBox.textContent = error.message;
                    errorBox.classList.remove('hidden');
                })
                .finally(function () {
                    loader.classList.add('hidden');
                });
        });
    });
})();
