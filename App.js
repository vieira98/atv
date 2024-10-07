import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

const fetchPessoas = async (setPessoas) => {
    try {
        const response = await fetch('http://172.26.36.98:3000/pessoa');
        const data = await response.json();
        setPessoas(data);
    } catch (error) {
        console.error('Error fetching pessoas:', error);
    }
};

export default function App() {
    const [pessoas, setPessoas] = useState([]);
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [UF, setUF] = useState('');
    const [telefone, setTelefone] = useState('');
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        fetchPessoas(setPessoas);
    }, []);

    const adicionarPessoa = async () => {
        try {
            await fetch('http://172.26.36.98:3000/pessoa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, endereco, bairro, cidade, UF, telefone }),
            });
            resetFields();
            fetchPessoas(setPessoas);
        } catch (error) {
            console.error('Error adding pessoa:', error);
        }
    };

    const editarPessoa = (id, nomeAtual, enderecoAtual, bairroAtual, cidadeAtual, UFatual, telefoneAtual) => {
        setEditandoId(id);
        setNome(nomeAtual);
        setEndereco(enderecoAtual);
        setBairro(bairroAtual);
        setCidade(cidadeAtual);
        setUF(UFatual);
        setTelefone(telefoneAtual);
    };

    const salvarPessoa = async () => {
        try {
            await fetch(`http://172.26.36.98:3000/pessoa/${editandoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, endereco, bairro, cidade, UF, telefone }),
            });
            resetFields();
            setEditandoId(null);
            fetchPessoas(setPessoas);
        } catch (error) {
            console.error('Error saving pessoa:', error);
        }
    };

    const cancelarEdicao = () => {
        resetFields();
        setEditandoId(null);
    };

    const resetFields = () => {
        setNome('');
        setEndereco('');
        setBairro('');
        setCidade('');
        setUF('');
        setTelefone('');
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            <TextInput placeholder="Endereço" value={endereco} onChangeText={setEndereco} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            <TextInput placeholder="Bairro" value={bairro} onChangeText={setBairro} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            <TextInput placeholder="Cidade" value={cidade} onChangeText={setCidade} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            <TextInput placeholder="UF" value={UF} onChangeText={setUF} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
            
            {editandoId ? (
                <>
                    <Button title="Salvar Alterações" onPress={salvarPessoa} />
                    <Button title="Cancelar" onPress={cancelarEdicao} />
                </>
            ) : (
                <Button title="Adicionar Pessoa" onPress={adicionarPessoa} />
            )}

            <FlatList
                data={pessoas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text>{item.nome} - {item.telefone}</Text>
                        <TouchableOpacity onPress={() => editarPessoa(item.id, item.nome, item.endereco, item.bairro, item.cidade, item.UF, item.telefone)}>
                            <Text style={{ color: 'blue', marginRight: 10 }}>Editar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}
