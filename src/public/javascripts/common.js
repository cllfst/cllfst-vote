
toLocaleDates()

function toLocaleDates() {
    var dates = document.getElementsByClassName('date')
    for (const item of dates) {
      item.innerText = new Date(item.textContent).toLocaleString()
    }
}
