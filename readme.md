------------------------Butler API Assignment--------------------
1. To run this application please clone the repo in a directory.
2. Please install Node JS (tested on v16.14.2)
3. Open command prompt at the project root folder location.
4. Run command "npm install" to install the dependencies.
5. Run command node server.js" to run the server.
6. It should give "Server listening on port 3000" message in terminal.
7. Open localhost:3000 in browser and you will see an HTML page.
8. Enter details and click "Submit" to send the request to API.
9. The response JSON will be stored in <project_folder>/res/response folder.
10. You can also test using curl command,
    curl --location 'localhost:3000/tickets' \
    --form 'attachment=@"/C:/Documents/dummy.txt"' \
    --form 'phoneNumber="9898989898"' \
    --form 'title="Sample Title"' \
    --form 'description="Sample Desc"'