/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/salas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.salas.forEach(item => insertList(item.nome, item.capacidade, item.descricao))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputDescription) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('capacidade', inputQuantity);
  formData.append('descricao', inputDescription);

  let url = 'http://127.0.0.1:5000/sala';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removida!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/sala?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova sala com nome, capacidade e descrição
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputDescription = document.getElementById("newDescription").value;

  if (inputProduct === '' || inputDescription === '' || inputQuantity === '') {
    alert("todos os itens são obrigatórios!");
  } else if (isNaN(inputQuantity)) {
    alert("capacidade precisa ser em números!");
  } else {
    insertList(inputProduct, inputQuantity, inputDescription)
    postItem(inputProduct, inputQuantity, inputDescription)
    alert("sala adicionada!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newDescription").value = "";

  removeElement()
}


 // ## Reservas

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de reservas existente no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getReservations = async () => {
  let url = 'http://127.0.0.1:5000/reservas';
  fetch(url, {
    method: 'get',
  })
      .then((response) => response.json())
      .then((data) => {
        clearReservationsTable(); // Limpa a tabela de reservas
        data.reservas.forEach(reservation => insertReservation(reservation.id, reservation.data_reserva, reservation.sala_id, reservation.horario_reserva, reservation.duracao_reserva))
      })
      .catch((error) => {
        console.error('Erro:', error);
      });
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar a tabela de reservas
  --------------------------------------------------------------------------------------
*/
const clearReservationsTable = () => {
  var table = document.getElementById('reservationsTable');
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getReservations()

/*
  --------------------------------------------------------------------------------------
  Função para enviar uma nova reserva para o servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postReservation = (date, room, time, duration) => {
  const formattedDate = formatDateForPost(date);

  const formData = new FormData();
  formData.append('data_reserva', formattedDate);
  formData.append('sala_id', room);
  formData.append('horario_reserva', time);
  formData.append('duracao_reserva', duration);

  let url = 'http://127.0.0.1:5000/reserva';
  return fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          return { success: false, message: data.message }; // Retorna objeto com erro
        });
      }
      return response.json().then((data) => {
        return { success: true, data: data }; // Retorna objeto com sucesso e dados da reserva
      });
    })
    .catch((error) => {
      console.error('Erro:', error);
      throw new Error("Erro ao adicionar a reserva. Por favor, tente novamente.");
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para remover uma reserva da tabela de reservas
  --------------------------------------------------------------------------------------
*/
const removeReservation = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let row = this.parentElement.parentElement;
      const id = row.getElementsByTagName('td')[0].innerHTML;
      const room = row.getElementsByTagName('td')[2].innerHTML;
      if (confirm("Tem certeza?")) {
        row.remove();
        deleteReservation(id, room);
        alert("Reserva removida!");
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para excluir uma reserva do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteReservation = (id, room) => {
  let url = `http://127.0.0.1:5000/reserva?id=${id}&sala_id=${room}`;
  fetch(url, {
    method: 'delete'
  })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Erro:', error);
      });
}


/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova reserva com data, sala, horário e duração
  --------------------------------------------------------------------------------------
*/
const newReservation = () => {
  let inputDate = document.getElementById("newDate").value;
  let inputRoom = document.getElementById("newRoom").value;
  let inputTime = document.getElementById("newTime").value;
  let inputDuration = document.getElementById("newDuration").value;

  if (inputDate === '' || inputRoom === '' || inputTime === '' || inputDuration === '') {
    alert("Todos os campos são obrigatórios!");
  } else {
    postReservation(inputDate, inputRoom, inputTime, inputDuration)
        .then((result) => {
          if (result.success) {
            clearReservationsTable(); // Limpa a tabela de reservas
            getReservations(); // Obtém novamente a lista de reservas atualizada
            alert("Reserva adicionada com sucesso!");
          } else {
            alert(`Erro ao adicionar a reserva: ${result.message}`); // Exibe a mensagem de erro do backend
          }
        })
        .catch((error) => {
          console.error('Erro:', error);
          alert(error.message); // Exibe a mensagem de erro do backend
        });
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para formatar a data no formato "dia/mês/ano"
  --------------------------------------------------------------------------------------
*/
const formatDateForPost = (date) => {
  const parts = date.split('-');
  const day = parts[2];
  const month = parts[1];
  const year = parts[0];

  return `${day}/${month}/${year}`;
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir uma reserva na tabela de reservas
  --------------------------------------------------------------------------------------
*/
const insertReservation = (id, date, room, time, duration) => {
  var reservation = [id, date, room, time, duration];
  var table = document.getElementById('reservationsTable');
  var row = table.insertRow();

  for (var i = 0; i < reservation.length; i++) {
    var cell = row.insertCell(i);
    cell.textContent = reservation[i];
  }
  insertButton(row.insertCell(-1));
  document.getElementById("newDate").value = "";
  document.getElementById("newRoom").value = "";
  document.getElementById("newTime").value = "";
  document.getElementById("newDuration").value = "";

  removeReservation();
}

